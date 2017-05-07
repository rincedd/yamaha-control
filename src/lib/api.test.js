import Api from './api';
import discover from './discover';
import Fetcher from './fetcher';

jest.mock('./fetcher');
jest.mock('./discover');

describe('The API handler', () => {
  let api: Api;
  let fetch;

  beforeEach(() => {
    fetch = jest.fn();
    api = new Api(fetch, 'an-ip-address');
  });

  it('sets the correct base URL for a given IP address/hostname', async () => {
    const url = await api.getBaseUrl();
    expect(url).toEqual('http://an-ip-address/YamahaExtendedControl/v1');
  });

  it('uses Fetcher to send requests for a path', async () => {
    await api.get('some/path?foo=bar');
    expect(Fetcher.instance.sendRequest)
      .toHaveBeenCalledWith('http://an-ip-address/YamahaExtendedControl/v1/some/path?foo=bar');
  });

  it('starts device discovery when requesting a path and no IP address was provided', async () => {
    const api2 = new Api(fetch);
    await api2.get('some/path?foo=bar');
    expect(discover).toHaveBeenCalled();
    expect(Fetcher.instance.sendRequest)
      .toHaveBeenCalledWith('http://discovered-address/YamahaExtendedControl/v1/some/path?foo=bar');
  });
});
