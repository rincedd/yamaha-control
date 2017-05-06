import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { getInstance } from 'peer-ssdp';
import discoverYamahaDevice from './discovery';

jest.mock('peer-ssdp');
jest.mock('node-fetch');

const SHORT_TIMEOUT = 10;

const failsafe = p => p.catch(() => {
});

describe('discoverYamahaDevice', () => {
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
    fetch.setMockResponseData('some-other-device');
    failsafe(discoverYamahaDevice());
    getInstance().emit('found', { LOCATION: 'an-url' }, { address: 'an-address' });
    expect(fetch).toHaveBeenCalledWith('an-url');
  });

  it('resolves with the device address if the device is a Yamaha device', () => {
    expect.assertions(1);
    fetch.setMockResponseData(fs.readFileSync(path.join(__dirname, '__mocks__/device.xml')));
    const p = discoverYamahaDevice();
    getInstance().emit('found', { LOCATION: 'an-url' }, { address: 'an-address' });
    return p.then(address => expect(address).toEqual('an-address'));
  });
});
