// @flow
import discoverYamahaDevice from './discover';
import sendRequest from './request';

export default class Api {
  ip: string;

  constructor(ip: ?string) {
    if (ip) {
      this.setIp(ip);
    }
  }

  setIp(ip: string) {
    this.ip = ip;
  }

  async getBaseUrl(): Promise<string> {
    if (!this.ip) {
      this.setIp(await discoverYamahaDevice());
    }
    return Promise.resolve(`http://${this.ip}/YamahaExtendedControl/v1`);
  }

  async get(path: string): Promise<Object> {
    const url = `${await this.getBaseUrl()}/${path}`;

    return sendRequest(url);
  }
}
