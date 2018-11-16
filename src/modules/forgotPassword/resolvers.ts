import { formatYupError } from './../../utils/formatYupError';
import { userNotFoundError, expiredKeyError } from './errorMessages';
import { User } from './../../entity/User';
import { createForgotPasswordLink } from './../../utils/createForgotPasswordLink';
import { forgotPasswordLockAccount } from './../../utils/forgotPasswordLockAccount';
import { ResolverMap } from "./../../types/graphql-utils";
import { forgotPasswordPrefix } from '../../constants';
import { registerPasswordValidation } from '../../yupSchemas';
import * as yup from 'yup';
import * as bcrypt from 'bcryptjs';

const schema = yup.object().shape({
 newPassword: registerPasswordValidation
});

export const resolvers: ResolverMap = {
  Query: {
    dummy2: () => "dummy2"
  },
  Mutation: {
    sendForgotPasswordEmail: async (
      _,
      { email }: GQL.ISendForgotPasswordEmailOnMutationArguments,
      { redis }
    ) => {

      const user = await User.findOne({ where: {email} });
      if(!user) {
        return {
          path: 'email',
          message: userNotFoundError
        } 
      }
      await forgotPasswordLockAccount(user.id, redis);
      // @todo add frontend url
      await createForgotPasswordLink("", user.id, redis);
      // @send email with url
      return true;
    },
    forgotPasswordChange: async ( 
      _,
      { newPassword, key }: GQL.IForgotPasswordChangeOnMutationArguments,
      { redis }
    ) => {

      const redisKey = `${forgotPasswordPrefix}${key}`;
      const userId = await redis.get(redisKey)

      console.log(`Rediskey: ${redisKey}`);
      console.log(`UserId ${userId}`);

      if (!userId) {
        return [{
          path: 'key',
          message: expiredKeyError
        }]
      }

      try {
        await schema.validate({ newPassword }, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatePromise = await User.update({ id: userId}, {
        forgotPasswordLocked: false,
        password: hashedPassword
      })

      const deleteKeyPromise = await redis.del(redisKey)

      await Promise.all([updatePromise, deleteKeyPromise]);

      return null;
    }
  }
};
