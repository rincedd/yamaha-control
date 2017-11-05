// @flow
import { createSocket } from 'dgram';
import NotificationDispatcher from './notification-dispatcher';

jest.mock('dgram');

describe('The notification dispatcher', () => {
  let dispatcher: NotificationDispatcher;
  let mockSocket;

  beforeEach(() => {
    dispatcher = new NotificationDispatcher();
    dispatcher.setPort(12345);
    dispatcher.start();
    mockSocket = createSocket.lastInstance;
  });

  afterEach(() => {
    createSocket.mockClear();
    Object.keys(mockSocket).forEach((key) => {
      if (mockSocket[key] && jest.isMockFunction(mockSocket[key])) {
        mockSocket[key].mockClear();
      }
    });
  });

  it('creates and binds an UDP4 socket on the specified port', () => {
    expect(createSocket).toHaveBeenCalledWith('udp4');
    expect(mockSocket.bind).toHaveBeenCalledWith(12345);
  });

  it('closes the socket on error and emits an error event', () => {
    const error = new Error('something went wrong');
    const spy = jest.fn();
    dispatcher.on('error', spy);
    mockSocket.emit('error', error);
    expect(mockSocket.close).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(error);
  });

  it('prevents the socket from keeping the node process running', () => {
    mockSocket.emit('listening');
    expect(mockSocket.unref).toHaveBeenCalled();
  });

  const TEST_CASES: Array<{ event: Object, zone?: mixed[], system?: mixed[], netusb?: mixed[] }> = [
    { event: { main: { power: 'standby' } }, zone: ['main', { power: 'standby' }] },
    {
      event: { main: { power: 'standby' }, netusb: { play_time: 30 } },
      zone: ['main', { power: 'standby' }],
      netusb: [{ play_time: 30 }],
    },
    {
      event: { netusb: { play_time: 30 }, system: { func_status_updated: true } },
      netusb: [{ play_time: 30 }],
      system: [{ func_status_updated: true }],
    },
  ];
  TEST_CASES.forEach(({ event, zone, system, netusb }, i) => {
    it(`dispatches events when receiving a message [${i}]`, () => {
      const zoneSpy = jest.fn();
      const systemSpy = jest.fn();
      const netusbSpy = jest.fn();
      dispatcher.on('change:zone', zoneSpy)
        .on('change:netusb', netusbSpy)
        .on('change:system', systemSpy);
      mockSocket.emit('message', Buffer.from(JSON.stringify(event)));
      if (zone) {
        expect(zoneSpy).toHaveBeenCalledWith(...zone);
      }
      if (system) {
        expect(systemSpy).toHaveBeenCalledWith(...system);
      }
      if (netusb) {
        expect(netusbSpy).toHaveBeenCalledWith(...netusb);
      }
    });
  });
});
