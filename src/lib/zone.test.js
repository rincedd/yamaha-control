import EventEmitter from 'events';
import Zone from './zone';

const MOCK_API_RESPONSE = { apiResponse: true };

describe('The Zone controller', () => {
  let zone: Zone;
  let mockApi;
  let mockDispatcher;

  beforeEach(() => {
    mockApi = { get: jest.fn().mockReturnValue(Promise.resolve(MOCK_API_RESPONSE)) };
    mockDispatcher = new EventEmitter();
    zone = new Zone(mockApi, mockDispatcher, 'zone-name');
  });

  const EVENT_TEST_CASES = [
    { event: { power: true }, zoneEvent: 'change:power', zoneEventData: true },
    { event: { power: false }, zoneEvent: 'change:power', zoneEventData: false },
    { event: { mute: true }, zoneEvent: 'change:mute', zoneEventData: true },
    { event: { mute: false }, zoneEvent: 'change:mute', zoneEventData: false },
    { event: { volume: 20 }, zoneEvent: 'change:volume', zoneEventData: 20 },
    { event: { volume: 0 }, zoneEvent: 'change:volume', zoneEventData: 0 },
  ];
  EVENT_TEST_CASES.forEach(({ event, zoneEvent, zoneEventData }, i) =>
    it(`should dispatch a ${zoneEvent} event when receiving a corresponding change:zone event [${i}]`, () => {
      const spy = jest.fn();
      zone.on(zoneEvent, spy);
      mockDispatcher.emit('change:zone', 'zone-name', event);
      expect(spy).toHaveBeenCalledWith(zoneEventData);
    }));

  it('should dispatch a statuschange event with the new zone status when receiving a corresponding change:zone event', (done) => {
    zone.on('change:status', (status) => {
      expect(status).toEqual(MOCK_API_RESPONSE);
      done();
    });
    mockDispatcher.emit('change:zone', 'zone-name', { status_updated: true });
  });

  it('should dispatch a signalchange event with the new signal info when receiving a corresponding change:zone event', (done) => {
    zone.on('change:signal', (status) => {
      expect(status).toEqual(MOCK_API_RESPONSE);
      done();
    });
    mockDispatcher.emit('change:zone', 'zone-name', { signal_info_updated: true });
  });

  it('should not dispatch any event when receiving a change:zone event for a different zone', () => {
    const spy = jest.fn();
    zone.on('change:power', spy)
      .on('change:mute', spy)
      .on('change:input', spy)
      .on('change:volume', spy)
      .on('change:status', spy)
      .on('change:signal', spy);
    mockDispatcher.emit('change:zone', 'other-zone', {
      power: true, input: 'hdmi4', volume: 42, mute: true, status_updated: true, signal_info_updated: true,
    });
    expect(spy).not.toHaveBeenCalled();
  });

  const METHOD_TEST_CASES = [
    { method: 'getStatus', request: 'zone-name/getStatus' },
    { method: 'getSignalInfo', request: 'zone-name/getSignalInfo' },
    { method: 'getSoundProgramList', request: 'zone-name/getSoundProgramList' },
    { method: 'isOn', request: 'zone-name/getStatus' },
    { method: 'powerOn', request: 'zone-name/setPower?power=on' },
    { method: 'powerOff', request: 'zone-name/setPower?power=standby' },
    { method: 'togglePower', request: 'zone-name/setPower?power=toggle' },
    { method: 'volumeUp', request: 'zone-name/setVolume?volume=up' },
    { method: 'volumeDown', request: 'zone-name/setVolume?volume=down' },
    { method: 'setMute', param: false, request: 'zone-name/setMute?enable=false' },
    { method: 'setMute', param: true, request: 'zone-name/setMute?enable=true' },
    { method: 'setMute', request: 'zone-name/setMute?enable=true' },
  ];
  METHOD_TEST_CASES.forEach(({ method, param, request }) => it(`should make the correct API request for ${method}`, () => {
    zone[method](param);
    expect(mockApi.get).toHaveBeenCalledWith(request);
  }));
});
