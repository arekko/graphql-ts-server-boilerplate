import { GraphQLMiddleware } from "./../types/graphql-utils";
import { Resolver } from "../types/graphql-utils";

export const createMiddleware = (
  middlewareFunc: GraphQLMiddleware,
  resolverFunc: Resolver
) => (parent: any, args: any, context: any, info: any) =>
  middlewareFunc(resolverFunc, parent, args, context, info);
