// @flow
import Api from './api';

type ZoneStatus = {
  response_code: number,
  power: 'on' | 'standby',
  sleep: number,
  volume: number,
  mute: boolean,
  sound_program: string
};

export default class Zone {
  api: Api;
  name: string;

  constructor(api: Api, name: string = 'main') {
    this.api = api;
    this.name = name;
  }

  getStatus(): Promise<ZoneStatus> {
    return this.api.get(`${this.name}/getStatus`);
  }

  getSoundProgramList(): Promise<Object> {
    return this.api.get(`${this.name}/getSoundProgramList`);
  }

  async isOn(): Promise<boolean> {
    const status = await this.getStatus();
    return status.power === 'on';
  }

  powerOn(): Promise<Object> {
    return this.api.get(`${this.name}/setPower?power=on`);
  }

  powerOff(): Promise<Object> {
    return this.api.get(`${this.name}/setPower?power=standby`);
  }

  togglePower(): Promise<Object> {
    return this.api.get(`${this.name}/setPower?power=toggle`);
  }

  volumeUp(): Promise<Object> {
    return this.api.get(`${this.name}/setVolume?volume=up`);
  }

  volumeDown(): Promise<Object> {
    return this.api.get(`${this.name}/setVolume?volume=down`);
  }
}
