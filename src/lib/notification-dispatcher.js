// @flow
import { createSocket } from 'dgram';
import EventEmitter from 'events';
import type { StatusChangeEvent } from './types';

type Socket = dgram$Socket;

export default class NotificationDispatcher extends EventEmitter {
  port: number;

  constructor(port: number) {
    super();
    this.port = port;
  }

  start() {
    const socket: Socket = createSocket('udp4');
    socket.on('error', (e: Error) => {
      socket.close();
      this.emit('error', e);
    });
    socket.on('message', (msg: Buffer) => {
      this.dispatch(JSON.parse(msg.toString()));
    });
    socket.on('listening', () => {
      socket.unref();
    });
    socket.bind(this.port);
  }

  dispatch(event: StatusChangeEvent) {
    if (event.main) {
      this.emit('change:zone', 'main', event.main);
    }
    if (event.system) {
      this.emit('change:system', event.system);
    }
    if (event.netusb) {
      this.emit('change:netusb', event.netusb);
    }
  }
}
