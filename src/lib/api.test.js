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

  afterEach(() => {
    sendRequest.mockClear();
  });

  it('sets the correct base URL for a given IP address/hostname', async () => {
    const url = await api.getBaseUrl();
    expect(url).toEqual('http://an-ip-address/YamahaExtendedControl/v1');
  });

  it('uses sendRequest to send requests for a path', async () => {
    await api.get('some/path?foo=bar');
    expect(sendRequest).toHaveBeenCalledWith('http://an-ip-address/YamahaExtendedControl/v1/some/path?foo=bar', expect.anything());
  });

  it('starts device discovery when requesting a path and no IP address was provided', async () => {
    const api2 = new Api();
    await api2.get('some/path?foo=bar');
    expect(discover).toHaveBeenCalled();
    expect(sendRequest).toHaveBeenCalledWith('http://discovered-address/YamahaExtendedControl/v1/some/path?foo=bar', expect.anything());
  });

  it('adds event subscription headers when requestNotifications is true', async () => {
    api.setNotificationPort(41234);
    api.setRequestNotifications();
    await api.get('some/path');
    expect(sendRequest).toHaveBeenCalledWith(expect.any(String), {
      'X-AppName': 'MusicCast/1.0',
      'X-AppPort': '41234',
    });
  });
});
