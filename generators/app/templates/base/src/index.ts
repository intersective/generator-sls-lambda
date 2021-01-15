import serverless from 'serverless-http';
import express, { Request, Response } from 'express';
import cors from 'cors';
import wrap from '@dazn/lambda-powertools-pattern-basic';

import dotenv from 'dotenv';
dotenv.config();

import { Log <% if (useJwtParser) { %>, jwtDecode <% } %> } from './utils';
import { dashboard } from './routes';

const app = express();
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

<% if (useJwtParser) { %>
const jwtParser = (req: Request, res: Response, next: any) => {
  const apikey = req.header('apikey');
  const service = req.header('service');
  let jwtPayload;
  try {
    jwtPayload = jwtDecode(apikey, service);
    res.locals.role = jwtPayload.role;
  } catch (error) {
    Log.error('JWT decoding failed', { apikey, service, error });
  }
  next();
};

app.use(jwtParser);
<% } %>

app.use('/dashboard', dashboard);

app.use((req: Request, res: Response, next: any) => {
  Log.warn('Request not found', { req });
  res.status(400).send({
    message: 'request not found',
  });
  next();
});

export const handler = wrap(serverless(app));
