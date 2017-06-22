global.fetch = require('node-fetch');
const Controller = require('./dist').Controller;

const c = new Controller('192.168.178.25');

async function run() {
  try {
    await c.mainZone.powerOff();
    const result = await c.netusb.getListInfo('net_radio', 0);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

run();
