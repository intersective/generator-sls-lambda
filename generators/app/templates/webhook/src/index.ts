import dotenv from 'dotenv';
dotenv.config();
const url = require('url');
import wrap from '@dazn/lambda-powertools-pattern-basic';

import { Log } from './utils';

export const handler = wrap(async (event: any, context: any) => {
  const endpoint = process.env.ENDPOINT;
  const pathname = url.parse(endpoint).pathname;
  const hostname = url.parse(endpoint).hostname;
  // An object of options to indicate where to post to
  const postOptions = {
    hostname: hostname,
    path: pathname,
    method: 'POST',
    port: 443,
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  Log.debug('received records', {records: event.Records});

  const requests = event.Records.map((record: any) => {
    return Promise.resolve(record.body);
  });

  Promise.allSettled(requests).then((responses: any) => {
    // all responses are resolved successfully
    for (const response of responses) {
      Log.debug('response status', {status: response.status});
    }
  }).catch((err: any) =>  {
    Log.debug('error', err);
  }).finally(() => {
    context.succeed();
  });
});