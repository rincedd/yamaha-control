import EventEmitter from 'events';

class Peer extends EventEmitter {
  constructor() {
    super();
    this.search = jest.fn();
    this.start = jest.fn();
    this.close = jest.fn();
  }
}

let instance;

export function createPeer() {
  instance = new Peer();
  return instance;
}

export function getInstance() {
  return instance;
}
export default {
  createPeer,
};
