import { User } from './entity/User';
import { ResolverMap } from './types/graphql.utils';
import { GQL } from './types/schema';
import * as bcrypt from 'bcryptjs'


export const resolvers: ResolverMap = {
    Query: {
      hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Hello ${name || 'World'}`,
    },
  

  Mutation: {
    register: async (_, { email, password }: GQL.IRegisterOnMutationArguments) => {

      const hashedPassword  = await bcrypt.hash(password, 10)
      const user = await User.create({
        email,
        password: hashedPassword
      })

      user.save()
      return true
    
    }
  }

};