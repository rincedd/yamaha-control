import EventEmitter from 'events';
import NetUsb from './netusb';
import type { PresetInfo } from './types';

const MOCK_API_RESPONSE = { apiResponse: true, preset_info: [] };

describe('The NetUSB controller', () => {
  let netusb: NetUsb;
  let mockApi;

  beforeEach(() => {
    mockApi = { get: jest.fn().mockReturnValue(Promise.resolve(MOCK_API_RESPONSE)) };
    netusb = new NetUsb(mockApi, new EventEmitter());
  });

  const METHOD_TEST_CASES = [
    { method: 'getPlaybackInfo', request: 'netusb/getPlayInfo' },
    {
      method: 'setPlayback',
      params: ['previous'],
      request: 'netusb/setPlayback?playback=previous',
    },
    { method: 'pause', request: 'netusb/setPlayback?playback=pause' },
    { method: 'play', request: 'netusb/setPlayback?playback=play' },
    { method: 'togglePause', request: 'netusb/setPlayback?playback=play_pause' },
    { method: 'stop', request: 'netusb/setPlayback?playback=stop' },
    {
      method: 'getListInfo',
      params: ['av4', 3],
      request: 'netusb/getListInfo?input=av4&index=3&size=8&lang=en',
    },
    {
      method: 'setListControl',
      params: ['av4', 'select', 3],
      request: 'netusb/setListControl?input=av4&type=select&index=3',
    },
    {
      method: 'getPresets',
      request: 'netusb/getPresetInfo',
    },
    {
      method: 'selectPreset',
      params: ['main', 3],
      request: 'netusb/recallPreset?zone=main&num=3',
    },

  ];
  METHOD_TEST_CASES.forEach(({ method, params = [], request }) => it(`makes the correct API request for ${method}()`, () => {
    netusb[method](...params);
    expect(mockApi.get).toHaveBeenCalledWith(request);
  }));

  it('retrieves the list of active presets', async () => {
    const presetInfo: PresetInfo = {
      preset_info: [
        { input: 'netusb', text: 'A preset' },
        { input: 'netusb', text: 'Another preset' },
        { input: 'unknown', text: 'Another preset' },
      ],
    };
    mockApi.get.mockReturnValue(Promise.resolve(presetInfo));
    await expect(netusb.getPresets()).resolves.toEqual([
      { input: 'netusb', text: 'A preset' },
      { input: 'netusb', text: 'Another preset' },
    ]);
  });
});
