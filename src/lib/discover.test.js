// @flow
import fs from 'fs';
import path from 'path';
import { getInstance } from 'peer-ssdp';
import Response from './__mocks__/response';
import discoverYamahaDevice from './discover';

jest.mock('peer-ssdp');

const SHORT_TIMEOUT = 10;

const failsafe = p => p.catch(() => {
});

describe('discoverYamahaDevice', () => {
  let fetcherResponseData;

  beforeEach(() => {
    fetcherResponseData = {};
    global.fetch = jest.fn(() => Promise.resolve(new Response(fetcherResponseData)));
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('starts an SSDP search for MediaRenderer devices', () => {
    failsafe(discoverYamahaDevice(SHORT_TIMEOUT));
    expect(getInstance().start).toHaveBeenCalled();
    getInstance().emit('ready');
    expect(getInstance().search).toHaveBeenCalledWith({ ST: 'urn:schemas-upnp-org:device:MediaRenderer:1' });
  });

  it('rejects if it cannot find a device within the provided timeout', () => {
    expect.assertions(1);
    return discoverYamahaDevice(SHORT_TIMEOUT)
      .catch(e => expect(e.message).toEqual('No Yamaha device found in network.'));
  });

  it('fetches the device description when a device is found', () => {
    fetcherResponseData = 'some-other-device';
    failsafe(discoverYamahaDevice());
    getInstance().emit('found', { LOCATION: 'an-url' }, { address: 'an-address' });
    expect(global.fetch).toHaveBeenCalledWith('an-url');
  });

  it('resolves with the device address if the device is a Yamaha device', () => {
    expect.assertions(1);
    fetcherResponseData = fs.readFileSync(path.join(__dirname, '__mocks__/device.xml'));
    const p = discoverYamahaDevice();
    getInstance().emit('found', { LOCATION: 'an-url' }, { address: 'an-address' });
    return p.then(address => expect(address).toEqual('an-address'));
  });
});
