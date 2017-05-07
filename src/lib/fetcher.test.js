// @flow
import Response from './__mocks__/response';
import Fetcher from './fetcher';

describe('sendRequest', () => {
  let fetcher: Fetcher;
  let fetch;

  beforeEach(() => {
    fetch = jest.fn().mockReturnValue(Promise.resolve(new Response({ response_code: 0 })));
    fetcher = new Fetcher(fetch);
  });

  it('makes a GET request by default', async () => {
    await fetcher.sendRequest('/my/path');
    expect(fetch).toHaveBeenCalledWith('/my/path', { method: 'GET' });
  });

  it('makes a POST request when params are supplied', async () => {
    await fetcher.sendRequest('/my/path', { foo: 'bar' });
    expect(fetch).toHaveBeenCalledWith('/my/path', { method: 'POST', body: '{"foo":"bar"}' });
  });

  it('parses the response JSON', async () => {
    const json = { response_code: 0, a: 'value', b: ['a', 'b', 'c'] };
    fetch.mockReturnValue(Promise.resolve(new Response(json)));
    const response = await fetcher.sendRequest('/my/path');
    expect(response).toEqual(json);
  });

  it('rejects when the response_code field is not 0', async () => {
    expect.assertions(1);
    fetch.mockReturnValue(Promise.resolve(new Response({ response_code: 3 })));
    try {
      await fetcher.sendRequest('/my/path');
    } catch (e) {
      expect(e.message).toEqual('Invalid Request');
    }
  });

  it('rejects with Unknown Error when the response code is not known', async () => {
    expect.assertions(1);
    fetch.mockReturnValue(Promise.resolve(new Response({ response_code: 4001 })));
    try {
      await fetcher.sendRequest('/my/path');
    } catch (e) {
      expect(e.message).toEqual('Unknown Error');
    }
  });

  it('rejects when fetch rejects', async () => {
    expect.assertions(1);
    fetch.mockImplementation(() => Promise.reject(new Error('error')));
    try {
      await fetcher.sendRequest('/my/path');
    } catch (e) {
      expect(e.message).toEqual('error');
    }
  });
});
