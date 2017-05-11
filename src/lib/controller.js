// @flow
import Api from './api';
import NetUsb from './netusb';
import SystemApi from './system';
import Zone from './zone';

export default class Controller {
  api: Api;
  mainZone: Zone;
  system: SystemApi;
  netusb: NetUsb;

  constructor(ip: ?string) {
    this.api = new Api(ip);
    this.system = new SystemApi(this.api);
    this.mainZone = new Zone(this.api, 'main');
    this.netusb = new NetUsb(this.api);
  }
}
