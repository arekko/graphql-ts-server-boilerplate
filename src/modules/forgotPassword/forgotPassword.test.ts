import { passwordNotLongEnough } from './../register/errorMessages';
import { forgotPosswordLockedError } from './../login/errorMessages';
import { forgotPasswordLockAccount } from './../../utils/forgotPasswordLockAccount';
import { TestClient } from "./../../utils/TestClient";
import { User } from "./../../entity/User";
import { createTypeormConnection } from "./../../utils/createTypeormConnection";
import { Connection } from "typeorm";
import { createForgotPasswordLink } from "../../utils/createForgotPasswordLink";

import * as Redis  from 'ioredis';
import { expiredKeyError } from './errorMessages';
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

    // lock accoun

    await forgotPasswordLockAccount(userId, redis);
    const url = await createForgotPasswordLink("", userId, redis);
    const parts = url.split('/');
    const key = parts[parts.length - 1]
    

    // make sure you cannot login to the locked account
    expect(await client.login(email, password)).toEqual({
      data: {
        login: [{
          path: 'email',
          message: forgotPosswordLockedError
        }]
      }
    })

   

    // try changing to a password thats too short
    expect(await client.forgotPasswordChange('s', key)).toEqual({
      data: {
        forgotPasswordChange: [{
          path: 'newPassword',
          message: passwordNotLongEnough
        }]
      }
 
    })


    const response = await client.forgotPasswordChange(newPassword, key);

    expect(response.data).toEqual({
      forgotPasswordChange: null
    });

    // make sure redis key expires after password change
    expect(await client.forgotPasswordChange('asdfasdfasd', key)).toEqual({
      data: {
        forgotPasswordChange: [{
          path: 'key',
          message: expiredKeyError
        }]
      }
 
    })
    
    expect(await client.login(email, newPassword)).toEqual({
      data: {
        login: null
      }
    })

  });
});
