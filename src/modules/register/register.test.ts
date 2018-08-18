import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from "./errorMessages";
import { User } from "./../../entity/User";

import { request } from "graphql-request";
import { startServer } from "../../startServer";

let getHost = () => "";

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = "bsob@bob.com";
const password = "12asd";

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

test("Register user test", async () => {
  const response = await request(getHost(), mutation(email, password));
  // check sure we can register a user
  expect(response).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);

  // test for duplicate email
  const response2: any = await request(getHost(), mutation(email, password));
  expect(response2.register).toHaveLength(1);
  expect(response2.register[0]).toEqual({
    path: "email",
    message: duplicateEmail
  });

  // catch bad email
  const response3: any = await request(getHost(), mutation("b", password));
  // expect(response3.register).toHaveLength(1);
  // expect(response3.register[0]).toEqual({
  //   path: "email",
  //   message: emailNotLongEnough
  // });
  expect(response3).toEqual({
    register: [
      {
        path: "email",
        message: emailNotLongEnough
      },
      {
        path: "email",
        message: invalidEmail
      }
    ]
  });

  // catch bad password
  const response4: any = await request(getHost(), mutation(email, "12"));
  expect(response4).toEqual({
    register: [
      {
        path: "password",
        message: passwordNotLongEnough
      }
    ]
  });

  // catch bad password and bad email
  const response5: any = await request(getHost(), mutation("as", "12"));
  expect(response5).toEqual({
    register: [
      {
        path: "email",
        message: emailNotLongEnough
      },
      {
        path: "email",
        message: invalidEmail
      },
      {
        path: "password",
        message: passwordNotLongEnough
      }
    ]
  });
});
