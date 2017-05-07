// @flow
import Api from './api';
import type { ZoneID, ZoneStatus } from './types';

export default class Zone {
  api: Api;
  name: string;

  constructor(api: Api, name: ZoneID = 'main') {
    this.api = api;
    this.name = name;
  }

  getStatus(): Promise<ZoneStatus> {
    return this.api.get(`${this.name}/getStatus`);
  }

  async getSoundProgramList(): Promise<string[]> {
    const response: Object = await this.api.get(`${this.name}/getSoundProgramList`);
    return response.sound_program_list || [];
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

  setMute(mute: boolean = true): Promise<Object> {
    return this.api.get(`${this.name}/setMute?enable=${mute.toString()}`);
  }
}
