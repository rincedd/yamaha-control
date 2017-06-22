// @flow
import Api from './api';
import NetUsb from './netusb';
import NotificationDispatcher from './notification-dispatcher';
import SystemApi from './system';
import Zone from './zone';

export default class Controller {
  api: Api;
  mainZone: Zone;
  system: SystemApi;
  netusb: NetUsb;
  dispatcher: NotificationDispatcher;

  constructor(ip: ?string) {
    this.api = new Api(ip);
    this.dispatcher = new NotificationDispatcher();
    this.system = new SystemApi(this.api, this.dispatcher);
    this.mainZone = new Zone(this.api, this.dispatcher, 'main');
    this.netusb = new NetUsb(this.api, this.dispatcher);
  }

  setUdpPort(udpPort: number) {
    this.api.setNotificationPort(udpPort);
    this.api.setRequestNotifications();
    this.dispatcher.setPort(udpPort);
    this.dispatcher.start();
  }
}
