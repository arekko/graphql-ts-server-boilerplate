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

describe("me", () => {
  test("return null if no cookie", async () => {
     const response2 = await axios.post(
      process.env.TEST_HOST as string,
      {
        query: meQuery
      },
    );

    expect(response2.data.data.me).toBeNull()
  })
    
  

  test("get current user", async () => {
    await axios.post(
      process.env.TEST_HOST as string,
      { 
        query: loginMutation(email, password)
      },
      {
        withCredentials: true
      }
    );

    const response = await axios.post(
      process.env.TEST_HOST as string,
      {
        query: meQuery
      },
      {
        withCredentials: true
      }
    );

    expect(response.data.data).toEqual({
      me: {
        id: userId.toString(),
        email
      }
    })
  });
});
