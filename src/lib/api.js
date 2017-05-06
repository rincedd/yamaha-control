// @flow
import discoverYamahaDevice from './discover';
import type { FetchFunction } from './fetcher';
import Fetcher from './fetcher';

export default class Api {
  baseUrl: string;
  fetcher: Fetcher;

  constructor(fetch: FetchFunction, ip: ?string) {
    this.fetcher = new Fetcher(fetch);
    if (ip) {
      this.setIp(ip);
    }
  }

  setIp(ip: string) {
    this.baseUrl = `http://${ip}/YamahaExtendedControl/v1`;
  }

  async getBaseUrl(): Promise<string> {
    if (!this.baseUrl) {
      this.setIp(await discoverYamahaDevice(this.fetcher));
    }
    return Promise.resolve(this.baseUrl);
  }

  async get(path: string): Promise<Object> {
    const url = `${await this.getBaseUrl()}/${path}`;

    return this.fetcher.sendRequest(url);
  }
}
