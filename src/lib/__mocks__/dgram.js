import EventEmitter from 'events';

// eslint-disable-next-line import/prefer-default-export
export const createSocket = jest.fn(() => {
  const socket = Object.assign(new EventEmitter(), {
    bind: jest.fn(),
    close: jest.fn(),
    unref: jest.fn(),
  });
  createSocket.lastInstance = socket;
  return socket;
});
