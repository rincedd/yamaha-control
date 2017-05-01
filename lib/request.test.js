const sendRequest = require('./request');

jest.mock('node-fetch');

const fetch = require('node-fetch');

describe('sendRequest', () => {
  afterEach(() => {
    fetch.mockClear();
  });

  it('makes a GET request by default', async () => {
    await sendRequest('/my/path');
    expect(fetch).toHaveBeenCalledWith('/my/path', { method: 'GET' });
  });

  it('makes a POST request when params are supplied', async () => {
    await sendRequest('/my/path', { foo: 'bar' });
    expect(fetch).toHaveBeenCalledWith('/my/path', { method: 'POST', body: '{"foo":"bar"}' });
  });

  it('parses the response JSON', async () => {
    const json = { response_code: 0, a: 'value', b: ['a', 'b', 'c'] };
    fetch.setMockResponseJSON(json);
    const response = await sendRequest('/my/path');
    expect(response).toEqual(json);
  });

  it('rejects when the response_code field is not 0', async () => {
    expect.assertions(1);
    fetch.setMockResponseJSON({ response_code: 3 });
    try {
      await sendRequest('/my/path');
    } catch (e) {
      expect(e.message).toEqual('Invalid Request');
    }
  });

  it('rejects with Unknown Error when the response code is not known', async () => {
    expect.assertions(1);
    fetch.setMockResponseJSON({ response_code: 4001 });
    try {
      await sendRequest('/my/path');
    } catch (e) {
      expect(e.message).toEqual('Unknown Error');
    }
  });

  it('rejects when fetch rejects', async () => {
    expect.assertions(1);
    fetch.mockImplementation(() => Promise.reject(new Error('error')));
    try {
      await sendRequest('/my/path');
    } catch (e) {
      expect(e.message).toEqual('error');
    }
  });
});
