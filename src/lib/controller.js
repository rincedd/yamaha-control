// @flow
import Api from './api';
import type { FetchFunction } from './fetcher';
import SystemApi from './system';
import Zone from './zone';

export default class Controller {
  api: Api;
  mainZone: Zone;
  system: SystemApi;

  constructor(fetch: FetchFunction, ip: ?string) {
    this.api = new Api(fetch, ip);
    this.system = new SystemApi(this.api);
    this.mainZone = new Zone(this.api, 'main');
  }
}
