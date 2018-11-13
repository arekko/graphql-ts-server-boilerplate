import { TestClient } from './../../utils/TestClient';
import { User } from "./../../entity/User";
import { createTypeormConnection } from "./../../utils/createTypeormConnection";
import { Connection } from "typeorm";
import axios from "axios";

let conn: Connection;

let userId: string;
const email = "arekko@mail.com";
const password = "fasdfkasdfjh";

const loginMutation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const meQuery = `
{
  me {
      id
      email
  }
}
`;
const logoutMutation = `
mutation {
  logout
}
`;

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
  test("test logging out the user", async () => {

  
  
    

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
