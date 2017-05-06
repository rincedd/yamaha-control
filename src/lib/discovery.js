import fetch from 'node-fetch';
import ssdp from 'peer-ssdp';

const manufacturer = /<manufacturer>Yamaha Corporation<\/manufacturer>/i;
const yamahaTag = /<yamaha:X_device>/i;

function discoverYamahaDevice(timeout = 5000) {
  return new Promise((resolve, reject) => {
    const peer = ssdp.createPeer();
    const timer = setTimeout(() => {
      if (peer) {
        peer.close();
      }
      reject(new Error('No Yamaha device found in network.'));
    }, timeout);

    peer.on('ready', () => {
      peer.search({ ST: 'urn:schemas-upnp-org:device:MediaRenderer:1' });
    });
    peer.on('found', async (headers, address) => {
      if (headers.LOCATION) {
        const response = await fetch(headers.LOCATION);
        if (response.status === 200) {
          const deviceDescription = await response.text();
          if (manufacturer.test(deviceDescription) && yamahaTag.test(deviceDescription)) {
            clearTimeout(timer);
            resolve(address.address);
          }
        }
      }
    });
    peer.start();
  });
}

export default discoverYamahaDevice;
