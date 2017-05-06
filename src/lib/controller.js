// @flow
import Api from './api';
import Zone from './zone';

export default class Controller {
  api: Api;
  mainZone: Zone;

  constructor(ip: ?string) {
    this.api = new Api(ip);
    this.mainZone = new Zone(this.api, 'main');
  }
}
