import { User } from "./../entity/User";
import fetch from "node-fetch";
import * as Redis from "ioredis";
import { createTypeormConnection } from "./createTypeormConnection";
import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { Connection } from "typeorm";

let userId = "";
const redis = new Redis();
let conn: Connection;

beforeAll(async () => {
  conn = await createTypeormConnection();
  const user = await User.create({
    email: "arekko@mail.com",
    password: "alskdasdfif"
  }).save();
  userId = user.id;
});

afterAll(async () => {
  await conn.close();
});

test("Make sure it confirms user and clears key in redis", async () => {
  const url = await createConfirmEmailLink(
    process.env.TEST_HOST as string,
    userId as string,
    redis
  );

  const respose = await fetch(url);
  const text = await respose.text();
  expect(text).toEqual("ok");
  const user = await User.findOne({ where: { id: userId } });
  expect((user as User).confirmed).toBeTruthy();
  const chunks = url.split("/");
  const key = chunks[chunks.length - 1];
  const value = await redis.get(key);
  expect(value).toBeNull();
  
});
