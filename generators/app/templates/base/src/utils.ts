export import Log = require('@dazn/lambda-powertools-logger');
const HTTP = require('@dazn/lambda-powertools-http-client');

<% if (useJwtParser) { %>
import jwtParser from '@practera/jwt-parser';
export const jwtDecode = (token: string, service: string) => jwtParser(token, process.env, service);
<% } %>

interface HttpOptions {
  url: string;
  headers: any;
  method: string;
  body: any;
}

export const httpRequest = (options: HttpOptions) =>
  HTTP({
    ...{
      headers: {
        'content-type': 'application/json',
      },
    },
    ...options,
  })
    .then((res: any) => res.body)
    .catch((error: any) => {
      Log.error('API request failed', {
        options,
        error,
      });
      return {};
    });