// @flow
import Response from './__mocks__/response';
import sendRequest from './request';

describe('sendRequest', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockReturnValue(Promise.resolve(new Response({ response_code: 0 })));
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('makes a GET request', async () => {
    await sendRequest('/my/path');
    expect(global.fetch).toHaveBeenCalledWith('/my/path', { method: 'GET', headers: {} });
  });

  it('adds request headers when supplied', async () => {
    await sendRequest('/my/path', { some: 'header' });
    expect(global.fetch).toHaveBeenCalledWith('/my/path', { method: 'GET', headers: { some: 'header' } });
  });

  it('parses the response JSON', async () => {
    const json = { response_code: 0, a: 'value', b: ['a', 'b', 'c'] };
    global.fetch.mockReturnValue(Promise.resolve(new Response(json)));
    const response = await sendRequest('/my/path');
    expect(response).toEqual(json);
  });

  it('rejects when the response_code field is not 0', async () => {
    expect.assertions(1);
    global.fetch.mockReturnValue(Promise.resolve(new Response({ response_code: 3 })));
    try {
      await sendRequest('/my/path');
    } catch (e) {
      expect(e.message).toEqual('Invalid Request');
    }
  });

  it('rejects with Unknown Error when the response code is not known', async () => {
    expect.assertions(1);
    global.fetch.mockReturnValue(Promise.resolve(new Response({ response_code: 4001 })));
    try {
      await sendRequest('/my/path');
    } catch (e) {
      expect(e.message).toEqual('Unknown Error');
    }
  });

  it('rejects when fetch rejects', async () => {
    expect.assertions(1);
    global.fetch.mockImplementation(() => Promise.reject(new Error('error')));
    try {
      await sendRequest('/my/path');
    } catch (e) {
      expect(e.message).toEqual('error');
    }
  });
});
