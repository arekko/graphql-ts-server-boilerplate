import { invalidLogin, confirmEmailError } from "./errorMessages";
import { User } from "./../../entity/User";
import { ResolverMap } from "./../../types/graphql-utils";
import * as bcrypt from "bcryptjs";

const errorResponse = [
  {
    path: "email",
    message: invalidLogin
  }
];

export const resolvers: ResolverMap = {
  Query: {
    bye2: () => "bye"
  },
  Mutation: {
    login: async (_, { email, password }: GQL.ILoginOnMutationArguments, { session }) => {
      const user = await User.findOne({ where: { email } });

      console.log(session)

      if (!user) {
        return errorResponse;
      }

      if (!user.confirmed) {
        return [{
          path: "email",
          message: confirmEmailError
        }]
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return errorResponse;
      }

      // login success
        session.userId = user.id;

        console.log(session)

      return null;
    }
  }
};
