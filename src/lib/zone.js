// @flow
import EventEmitter from 'events';
import Api from './api';
import NotificationDispatcher from './notification-dispatcher';
import type { SimpleResponse, ZoneChangeInfo, ZoneID, ZoneStatus } from './types';

export default class Zone extends EventEmitter {
  api: Api;
  name: string;

  constructor(api: Api, dispatcher: NotificationDispatcher, name: ZoneID = 'main') {
    super();
    this.api = api;
    this.name = name;
    dispatcher.on('change:zone', (zone: ZoneID, event: ZoneChangeInfo) => {
      if (event.power) {
        this.emit('powerchange', event.power);
      }
      if ('mute' in event) {
        this.emit('mutechange', event.mute);
      }
      if (event.input) {
        this.emit('inputchange', event.input);
      }
      if ('volume' in event) {
        this.emit('volumechange', event.volume);
      }
      if (event.status_updated) {
        this.getStatus().then(status => this.emit('statuschange', status));
      }
      if (event.signal_info_updated) {
        this.emit('signalchange');
      }
    });
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

  powerOn(): Promise<SimpleResponse> {
    return this.api.get(`${this.name}/setPower?power=on`);
  }

  powerOff(): Promise<SimpleResponse> {
    return this.api.get(`${this.name}/setPower?power=standby`);
  }

  togglePower(): Promise<SimpleResponse> {
    return this.api.get(`${this.name}/setPower?power=toggle`);
  }

  volumeUp(): Promise<SimpleResponse> {
    return this.api.get(`${this.name}/setVolume?volume=up`);
  }

  volumeDown(): Promise<SimpleResponse> {
    return this.api.get(`${this.name}/setVolume?volume=down`);
  }

  setMute(mute: boolean = true): Promise<SimpleResponse> {
    return this.api.get(`${this.name}/setMute?enable=${mute.toString()}`);
  }
}
