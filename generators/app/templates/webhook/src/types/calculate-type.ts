'use strict';
const logger = require('@dazn/lambda-powertools-logger');
import { Base } from './base';
import { Default } from './default';

export function calculateType (action: string, record: any, env: any) : Base {
  let type : Base;
  switch(action) {
    case "Default":
      logger.debug('This is a Default notification');
      type = new Default(record, env);
      break;
    default:
      logger.error('Error getting the type', {action: action, record: record});
      throw new Error('Error getting the type');
  }
  return type;
}
