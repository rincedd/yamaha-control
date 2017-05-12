// @flow
import EventEmitter from 'events';
import Api from './api';
import NotificationDispatcher from './notification-dispatcher';
import type { DeviceInfo, FeatureInfo, InputID, SoundProgramID, SystemChangeInfo, ZoneID } from './types';

export type IdToNameMaps = {
  zones: { [ZoneID]: string },
  inputs: { [InputID]: string },
  soundPrograms: { [SoundProgramID]: string },
};

function listToMap<U: string>(list: Array<{ id: U, text: string }>): { [U]: string } {
  const o = {};
  list.forEach(({ id, text }) => {
    o[id] = text;
  });
  return o;
}

export default class SystemApi extends EventEmitter {
  api: Api;

  constructor(api: Api, dispatcher: NotificationDispatcher) {
    super();
    this.api = api;
    dispatcher.on('change:system', (event: SystemChangeInfo) => {
      if (event.func_status_updated) {
        this.emit('funcchange');
      }
      if (event.bluetooth_info_updated) {
        this.emit('bluetoothchange');
      }
      if (event.name_text_updated) {
        this.emit('namechange');
      }
      if (event.location_info_updated) {
        this.emit('locationchange');
      }
    });
  }

  getDeviceInfo(): Promise<DeviceInfo> {
    return this.api.get('system/getDeviceInfo');
  }

  getFeatures(): Promise<FeatureInfo> {
    return this.api.get('system/getFeatures');
  }

  async getNameForId(id: ZoneID | InputID | SoundProgramID): Promise<string> {
    const response = await this.api.get(`system/getNameText?id=${id}`);
    return response.text;
  }

  async getNamesForIds(): Promise<IdToNameMaps> {
    const response = await this.api.get('system/getNameText');
    return {
      zones: listToMap(response.zone_list),
      inputs: listToMap(response.input_list),
      soundPrograms: listToMap(response.sound_program_list),
    };
  }
}
