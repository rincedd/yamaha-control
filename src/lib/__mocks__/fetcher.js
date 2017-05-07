// @flow
export default class Fetcher {
  static instance: Fetcher;

  fetch: (string, ?Object) => Promise<Response>;
  sendRequest: (string, ?Object) => Promise<Object>;

  constructor(fetch: (string, ?Object) => Promise<Response>) {
    this.fetch = fetch;
    this.sendRequest = jest.fn().mockReturnValue(Promise.resolve({}));
    Fetcher.instance = this;
  }
}
