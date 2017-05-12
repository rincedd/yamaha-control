// @flow
import discoverYamahaDevice from './discover';
import sendRequest from './request';

export default class Api {
  ip: string;
  notificationPort: ?number;
  requestNotifications: boolean;

  constructor(ip: ?string, notificationPort: ?number) {
    this.notificationPort = notificationPort;
    this.requestNotifications = !!notificationPort;
    if (ip) {
      this.setIp(ip);
    }
  }

  setIp(ip: string) {
    this.ip = ip;
  }

  setRequestNotifications(requestNotifications: boolean = true) {
    this.requestNotifications = requestNotifications;
  }

  setNotificationPort(notificationPort: number) {
    this.notificationPort = notificationPort;
  }

  async getBaseUrl(): Promise<string> {
    if (!this.ip) {
      this.setIp(await discoverYamahaDevice());
    }
    return Promise.resolve(`http://${this.ip}/YamahaExtendedControl/v1`);
  }

  async get(path: string): Promise<Object> {
    const url = `${await this.getBaseUrl()}/${path}`;

    return sendRequest(url, this.getRequestHeaders());
  }

  getRequestHeaders(): ?{ [string]: string } {
    if (this.requestNotifications) {
      return {
        'X-AppName': 'MusicCast/1.0',
        'X-AppPort': String(this.notificationPort),
      };
    }
    return {};
  }
}
