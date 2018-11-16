import { forgotPasswordPrefix } from './../constants';
// http://localhost:4000
// https://my-site.com
// => https://mysite.com/confirm/<id>

import { v4 } from "uuid";
import { Redis } from "ioredis";

export const createForgotPasswordLink =  async (url: string, userId: string, redis: Redis) => {
  const id = v4();
  // 20 min expired time
  await redis.set(`${forgotPasswordPrefix}${id}`, userId, 'ex', 60 * 20);
  return `${url}/change-password/${id}`;
};
