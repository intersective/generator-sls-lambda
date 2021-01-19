import { ApolloServer } from 'apollo-server-lambda';
import typeDefs from './type-defs';
import { resolvers } from './apolloServer';
import { Http } from './data-sources';

export const constructTestServer = (context = {}) => {
  const defaultContext = {
    user: {
      uuid: 'user-uuid',
    },
  };
  const http = new Http();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ http }),
    context: { ...defaultContext, ...context },
  });
  return { server, http };
};
