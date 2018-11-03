// http://localhost:4000
// https://my-site.com
// => https://mysite.com/confirm/<id>

import { v4 } from "uuid";
import { Redis } from "ioredis";

export const createConfirmEmailLink =  async (url: string, userId: string, redis: Redis) => {
  const id = v4();
  await redis.set(id, userId, 'ex', 60 * 60 * 24);
  console.log(`${url}/confirm/${id}`);
  return `${url}/confirm/${id}`;
};
