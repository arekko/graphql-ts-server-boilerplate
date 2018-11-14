import { TestClient } from './../../utils/TestClient';
import { User } from "./../../entity/User";
import { createTypeormConnection } from "./../../utils/createTypeormConnection";
import { Connection } from "typeorm";

let conn: Connection;

let userId: string;
const email = "arekko@mail.com";
const password = "fasdfkasdfjh";

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

describe("logout test", () => {

  test('multiple session', async () => {
    
    // computer one
    const sess1 = new TestClient(process.env.TEST_HOST as string)
    // computer two
    const sess2 = new TestClient(process.env.TEST_HOST as string);

    await sess1.login(email, password);
    await sess2.login(email, password);

    expect(await sess1.me()).toEqual(await sess2.me());

    await sess1.logout();

    expect(await sess1.me()).toEqual(await sess2.me());
  });

  test("single session", async () => {

    const client = new TestClient(process.env.TEST_HOST as string);

    await client.login(email, password);
    const response = await client.me();

  
    expect(response.data).toEqual({
      me: {
        id: userId.toString(),
        email
      }
    })

    await client.logout()

    const response2 = await client.me()

    expect(response2.data.me).toBeNull()

    })
});
