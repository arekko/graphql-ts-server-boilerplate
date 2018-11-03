import { Connection } from 'typeorm';
import { request } from "graphql-request";
import { invalidLogin, confirmEmailError } from "./errorMessages";
import { User } from "../../entity/User";
import { createTypeormConnection } from "../../utils/createTypeormConnection";

const email = "bsob@bob.com";
const password = "12asd";

const registerMutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const loginMutation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const LoginExpectError = async (e: string, p: string, errMessage: string) => {
  const response = await request(
    process.env.TEST_HOST as string,
    loginMutation(e, p)
  );

  expect(response).toEqual({
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
    await LoginExpectError("andrei@mail.com", "whatever", invalidLogin);
  });

  test("email not confirmed", async () => {
    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password)
    );

    await LoginExpectError(email, password, confirmEmailError);

    await User.update({ email }, { confirmed: true });

    await LoginExpectError(email, "asdlkfhaskd", invalidLogin);

    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, password)
    );

    expect(response).toEqual({ login: null });
  });
});
