import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';
import { Log, httpRequest } from '../utils';
import HTTP from '@dazn/lambda-powertools-http-client';

interface CachedPromise {
  cachedAt: number;
  promise: Promise<any>;
}

export class Http extends RESTDataSource {
  baseURL = '';
  // use caching strategy for user detail data
  cacheValidPeriod = 1000 * 60 * 10; // 10 minutes
  cache = new Map<string, CachedPromise>();

  constructor() { super(); }

  /**
   * Read the data from the cache if it is cached and not expired.
   * Otherwise make API request to get the data and cache it.
   * callback     callback function of the request response
   */
  readFromCacheFirst(requestOptions: any, callback: any, cacheValidPeriod: number = this.cacheValidPeriod): Promise<any> {
    const cacheKey = JSON.stringify(requestOptions);
    let cachedData = this.cache.get(cacheKey);
    // use cached promise if cache found and not expired
    if (cachedData && cachedData.cachedAt + cacheValidPeriod > Date.now()) {
      Log.info('Cache found', { requestOptions });
      return cachedData.promise;
    }
    // send request to get the data if cache not found
    Log.info('Sending request to Http', { requestOptions });
    cachedData = {
      cachedAt: Date.now(),
      promise: httpRequest(requestOptions).then(callback),
    };
    this.cache.set(cacheKey, cachedData);
    return cachedData.promise;
  }

  // example
  getUsers() {
    const requestOptions = {
      url: `${ this.baseURL }/users`,
      method: 'GET'
    };
    return this.readFromCacheFirst(requestOptions, res => res.data);
  }

}
