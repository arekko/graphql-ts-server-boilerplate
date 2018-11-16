import { TestClient } from './../../utils/TestClient';
import { Connection } from 'typeorm';
import { invalidLogin, confirmEmailError } from "./errorMessages";
import { User } from "../../entity/User";
import { createTypeormConnection } from "../../utils/createTypeormConnection";

const email = "bsob@bob.com";
const password = "12asd";



const LoginExpectError = async (client: TestClient, e: string, p: string, errMessage: string) => {

  const response = await client.login(e, p)

  expect(response.data).toEqual({
    login: [
      {
        path: "email",
        message: errMessage
      }
    ]
  });
};


let conn: Connection;

beforeAll(async () => {
  conn = await createTypeormConnection();
});

afterAll(async () => {
  await conn.close();
});


describe("login", () => {
  test("email not found send back error", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    await LoginExpectError(client, "andrei@mail.com", "whatever", invalidLogin);
  });

  test("email not confirmed", async () => {
      const client = new TestClient(process.env.TEST_HOST as string);

    await client.register(email, password);

    await LoginExpectError(client, email, password, confirmEmailError);

    await User.update({ email }, { confirmed: true });

    await LoginExpectError(client, email, "asdlkfhaskd", invalidLogin);

    const response = await client.login(email, password);

    expect(response.data).toEqual({ login: null });
  });
});
