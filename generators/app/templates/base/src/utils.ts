export import Log = require('@dazn/lambda-powertools-logger');

<% if (useJwtParser) { %>
import jwtParser from '@practera/jwt-parser';
export const jwtDecode = (token: string, service: string) => jwtParser(token, process.env, service);
<% } %>
