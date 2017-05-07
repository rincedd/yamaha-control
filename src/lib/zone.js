// @flow
import Api from './api';

export type ToneControlStatus = {
  mode: string,
  bass: number,
  treble: number
};

export type ZoneStatus = {
  response_code: number,
  power: 'on' | 'standby',
  sleep: 0 | 30 | 60 | 90 | 120,
  volume: number,
  mute: boolean,
  input: string,
  sound_program: string,
  surround_3d: boolean,
  direct: boolean,
  pure_direct: boolean,
  enhancer: boolean,
  tone_control: ToneControlStatus
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

  async getSoundProgramList(): Promise<Array<string>> {
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
