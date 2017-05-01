const fetch = require('node-fetch');

const RESPONSE_CODES = {
  1: 'Initializing',
  2: 'Internal Error',
  3: 'Invalid Request',
  4: 'Invalid Parameter',
  5: 'Guarded',
  6: 'Timeout',
  99: 'Firmware Updating',
  100: 'Streaming Service: Access Error',
  101: 'Streaming Service: Other Errors',
  102: 'Streaming Service: Wrong User Name',
  103: 'Streaming Service: Wrong Password',
  104: 'Streaming Service: Account Expired',
  105: 'Streaming Service: Account Disconnected/Gone Off/Shut Down',
  106: 'Streaming Service: Account Reached to the Limit',
  107: 'Streaming Service: Server Maintenance',
  108: 'Streaming Service: Invalid Account',
  109: 'Streaming Service: License Error',
  110: 'Streaming Service: Read Only Mode',
  111: 'Streaming Service: Max Stations',
  112: 'Streaming Service: Access Denied',
};

function getErrorMessage(responseCode) {
  return RESPONSE_CODES[responseCode] || 'Unknown Error';
}

module.exports = function sendRequest(url, params = null) {
  const opts = { method: 'GET' };
  if (params) {
    opts.method = 'POST';
    opts.body = JSON.stringify(params);
  }
  return fetch(url, opts)
    .then(response => response.json())
    .then((result) => {
      if (result.response_code !== 0) {
        throw new Error(getErrorMessage(result.response_code), result.response_code);
      }
      return result;
    });
};
