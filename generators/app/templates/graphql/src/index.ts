import { ApolloServer, IResolvers } from 'apollo-server-lambda';
import * as queries from './resolvers/queries';
import * as mutations from './resolvers/mutations';
import * as user from './resolvers/user';
import typeDefs from './type-defs';
import { Http } from './data-sources';
import wrap from '@dazn/lambda-powertools-pattern-basic';
import { Log <% if (useJwtParser) { %>, jwtDecode <% } %>} from './utils';
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = !NODE_ENV || !['production'].includes(NODE_ENV);

export const resolvers = {
  Mutation: mutations,
  Query: queries,
  User: user,
} as IResolvers;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    http: new Http(),
  }),
  // subscriptions: {},
  introspection: IS_DEV,
  context: req => <% if (useJwtParser) { %>parseJWT(req)<% } else {%>{}<% }%>,
});

<% if (useJwtParser) { %>
/**
 * Parse JWT and store necessary info in memory
 * @param req Request Object
 */
async function parseJWT(req) {
  const headers = req.event.headers;
  const context = {
    apikey: headers.apikey,
    user: {
      uuid: null,
    },
    service: null,
  };
  if (!headers.apikey) {
    Log.warn('JWT not found');
    return context;
  }
  const service = headers.service || '';
  context.service = service;
  let payload;
  try {
    payload = jwtDecode(headers.apikey, service);
  } catch (error) {
    Log.error('JWT decoding failed', { apikey: headers.apikey, service, error });
    throw new Error(error);
  }
  // get user data from jwt and save it in context
  context.user.uuid = payload.user_uuid;
  return context;
}
<% } %>

function runApollo(event: APIGatewayProxyEvent, context: Context, apollo: any) {
  return new Promise((resolve, reject) => {
    const callback = (error: any, body: any) =>
      error ? reject(error) : resolve(body);
    apollo(event, context, callback);
  });
}

async function apolloHandler(event: APIGatewayProxyEvent, context: Context, cb: Callback) {
  if (!event.httpMethod) {
    Log.debug('empty proxy event');
    return Promise.resolve('');
  }
  const apollo = apolloServer.createHandler({
    cors: {
      origin: '*',
    },
  });

  event.httpMethod = event.httpMethod || 'POST';
  event.headers = {
    'content-type': 'application/json',
    ...(event.headers || {}),
  };

  try {
    return await runApollo(event, context, apollo);
  } catch (err) {
    cb(err, null);
  }
  return Promise.resolve('');
}

export const handler = wrap(apolloHandler);
