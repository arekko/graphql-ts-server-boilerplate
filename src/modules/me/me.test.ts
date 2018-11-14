import { User } from "./../../entity/User";
import { createTypeormConnection } from "./../../utils/createTypeormConnection";
import { Connection } from "typeorm";
import axios from "axios";
import { TestClient } from "../../utils/TestClient";

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

describe("me", () => {
  const client  = new TestClient(process.env.TEST_HOST as string);


  test("return null if no cookie", async () => {

    const response2 = await client.me()


    //  const response2 = await axios.post(
    //   process.env.TEST_HOST as string,
    //   {
    //     query: meQuery
    //   },
    // );

    expect(response2.data.me).toBeNull()
  })
    
  

  test("get current user", async () => {


    // await axios.post(
    //   process.env.TEST_HOST as string,
    //   { 
    //     query: loginMutation(email, password)
    //   },
    //   {
    //     withCredentials: true
    //   }
    // );

    await client.login(email, password);

    const response = await client.me()


    // const response = await axios.post(
    //   process.env.TEST_HOST as string,
    //   {
    //     query: meQuery
    //   },
    //   {
    //     withCredentials: true
    //   }
    // );


    expect(response.data).toEqual({
      me: {
        id: userId.toString(),
        email
      }
    })
  });
});
