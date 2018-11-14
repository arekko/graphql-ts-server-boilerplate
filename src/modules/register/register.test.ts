import { Connection } from 'typeorm';
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from "./errorMessages";
import { User } from "./../../entity/User";

import { createTypeormConnection } from '../../utils/createTypeormConnection';
import { TestClient } from '../../utils/TestClient';

const email = "bsob@bob.com";
const password = "12asd";

let conn: Connection;

beforeAll(async () => {
  conn = await createTypeormConnection();
});

afterAll(async () => {
   await conn.close();
});

test("Register user test", async () => {

  const client = new TestClient(process.env.TEST_HOST as string)

  const response = await client.register(email, password);
  // check sure we can register a user
  expect(response.data).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);

  // test for duplicate email

  const response2 = await client.register(email, password)
  expect(response2.data.register).toHaveLength(1);
  expect(response2.data.register[0]).toEqual({
    path: "email",
    message: duplicateEmail
  });

  // catch bad email
  const response3 = await client.register('e', password )

  expect(response3.data).toEqual({
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
  const response4 = await client.register(email, '12')
  expect(response4.data).toEqual({
    register: [
      {
        path: "password",
        message: passwordNotLongEnough
      }
    ]
  });

  // catch bad password and bad email

  const response5 = await client.register('as', '34')
  expect(response5.data).toEqual({
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
