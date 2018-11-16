import { removeAllUsersSessions } from './removeAllUsersSessions';
import { User } from './../entity/User';
import { Redis } from 'ioredis';

export const forgotPasswordLockAccount = async (userId: string, redis: Redis) => {
  // can't login
  await User.update({ id: userId }, { forgotPasswordLocked: true });
  
  // remove all user sessions
  await removeAllUsersSessions(userId, redis);
}