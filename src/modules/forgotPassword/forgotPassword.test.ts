import { TestClient } from "./../../utils/TestClient";
import { User } from "./../../entity/User";
import { createTypeormConnection } from "./../../utils/createTypeormConnection";
import { Connection } from "typeorm";
import { createForgotPasswordLink } from "../../utils/createForgotPasswordLink";

import * as Redis  from 'ioredis';
export const redis = new Redis();

let conn: Connection;

let userId: string;
const email = "arekko@mail.com";
const password = "fasdfkasdfjh";
const newPassword = "asdfkjasdhf";

beforeAll(async () => {
  conn = await createTypeormConnection();
  const user = await User.create({
    email,
    password,
    confirmed: true
  }).save();
  userId = user.id;
});

afterAll(async () => {
  await conn.close();
});

describe("forgot password", () => {
  test("forgot password test", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);


    const url = await createForgotPasswordLink("", userId, redis);
    const parts = url.split('/');
    const key = parts[parts.length - 1]

    const response = await client.forgotPasswordChange(newPassword, key);
    expect(response.data).toEqual({
      forgotPasswordChange: null
    });

    expect(await client.login(email, newPassword)).toEqual({
      data: {
        login: null
      }
    })

  });
});
