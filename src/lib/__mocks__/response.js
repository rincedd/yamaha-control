// @flow
export default class Response {
  data: mixed;
  status: number;

  constructor(data: mixed, status: number = 200) {
    this.data = data;
    this.status = status;
  }

  json(): Promise<mixed> {
    return Promise.resolve(this.data);
  }

  text(): Promise<mixed> {
    return Promise.resolve(this.data);
  }
}
