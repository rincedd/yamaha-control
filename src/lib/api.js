// @flow
import discoverYamahaDevice from './discover';
import type { FetchFunction } from './fetcher';
import Fetcher from './fetcher';

export default class Api {
  baseUrl: string;
  fetcher: Fetcher;
  ip: string;

  constructor(fetch: FetchFunction, ip: ?string) {
    this.fetcher = new Fetcher(fetch);
    if (ip) {
      this.setIp(ip);
    }
  }

  setIp(ip: string) {
    this.ip = ip;
  }

  async getBaseUrl(): Promise<string> {
    if (!this.ip) {
      this.setIp(await discoverYamahaDevice(this.fetcher));
    }
    return Promise.resolve(`http://${this.ip}/YamahaExtendedControl/v1`);
  }

  async get(path: string): Promise<Object> {
    const url = `${await this.getBaseUrl()}/${path}`;

    return this.fetcher.sendRequest(url);
  }
}
