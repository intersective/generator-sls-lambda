import { SQSEvent, SQSRecord } from "aws-lambda";
import dotenv from 'dotenv';
dotenv.config();
import wrap from '@dazn/lambda-powertools-pattern-basic';
const logger = require('@dazn/lambda-powertools-logger');
import { calculateType } from "./types/calculate-type";

const processRecord = (record: SQSRecord) => {
  logger.debug("record being processed", { record: record });
  if(record.messageAttributes.type.stringValue === undefined) {
    logger.debug("Could not identify type", { record: record });
    return Promise.reject("Request type not set up");
  }
  const type = calculateType(record.messageAttributes.type.stringValue, JSON.parse(record.body), process.env);
  return type.send();
};

export const handler = wrap(async (event: SQSEvent, context: any) => {
  logger.debug('records processed', { records: event.Records });

  const preWrapPromises = event.Records.map(processRecord);

  Promise.allSettled(preWrapPromises).then(responses => {
    // all responses are resolved successfully
    for (const response of responses) {
      logger.debug('response status', {response:response, status: response.status});
    }
  }).catch(function(err) {
    logger.debug('error', err);
  }).finally(function() {
    context.succeed();
  });
});
