import discoverYamahaDevice from './discovery';
// @flow
import sendRequest from './request';

export default class Api {
  baseUrl: string;

  constructor(ip: ?string) {
    if (ip) {
      this.setIp(ip);
    }
  }

  setIp(ip: string) {
    this.baseUrl = `http://${ip}/YamahaExtendedControl/v1`;
  }

  async getBaseUrl(): Promise<string> {
    if (!this.baseUrl) {
      this.setIp(await discoverYamahaDevice());
    }
    return Promise.resolve(this.baseUrl);
  }

  async get(path: string): Promise<Object> {
    const url = `${await this.getBaseUrl()}/${path}`;

    return sendRequest(url);
  }
}
