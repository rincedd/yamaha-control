// @flow
import Api from './api';
import type { FetchFunction } from './fetcher';
import Zone from './zone';

export default class Controller {
  api: Api;
  mainZone: Zone;

  constructor(fetch: FetchFunction, ip: ?string) {
    this.api = new Api(fetch, ip);
    this.mainZone = new Zone(this.api, 'main');
  }
}
