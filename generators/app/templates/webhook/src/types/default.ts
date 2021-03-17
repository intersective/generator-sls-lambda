import { Base, Response, Record } from './base';
import Axios, { AxiosRequestConfig } from 'axios';
import JWT from 'jsonwebtoken';
const logger = require('@dazn/lambda-powertools-logger');

export class Default extends Base {
  protected record: Record;
  protected env: any;

  constructor(record: Record, env: any) {
    super();
    this.record = record;
    this.env = env;
  }

  private createHeaders() : AxiosRequestConfig {
    return {
      timeout: 20000,
      headers: {
        service: this.env.SERVICE,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        apikey: JWT.sign({ role: 'system' }, this.env.PRIVATE_JWT, { algorithm: 'RS256' }),
      },
    };
  }

  async send() : Promise<Response> {
    return new Promise(resolve => {
      Axios.get(this.env.URL, this.createHeaders()).then(response => {
        resolve(response.data);
      });
    });
  }
}
