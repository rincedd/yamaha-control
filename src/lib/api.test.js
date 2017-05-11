import Api from './api';
import discover from './discover';
import sendRequest from './request';

jest.mock('./request');
jest.mock('./discover');

describe('The API handler', () => {
  let api: Api;

  beforeEach(() => {
    api = new Api('an-ip-address');
  });

  it('sets the correct base URL for a given IP address/hostname', async () => {
    const url = await api.getBaseUrl();
    expect(url).toEqual('http://an-ip-address/YamahaExtendedControl/v1');
  });

  it('uses Fetcher to send requests for a path', async () => {
    await api.get('some/path?foo=bar');
    expect(sendRequest).toHaveBeenCalledWith('http://an-ip-address/YamahaExtendedControl/v1/some/path?foo=bar');
  });

  it('starts device discovery when requesting a path and no IP address was provided', async () => {
    const api2 = new Api();
    await api2.get('some/path?foo=bar');
    expect(discover).toHaveBeenCalled();
    expect(sendRequest).toHaveBeenCalledWith('http://discovered-address/YamahaExtendedControl/v1/some/path?foo=bar');
  });
});
