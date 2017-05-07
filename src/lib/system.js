// @flow
import Api from './api';
import type { DeviceInfo, FeatureInfo, InputID, SoundProgramID, ZoneID } from './types';

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

export default class SystemApi {
  api: Api;

  constructor(api: Api) {
    this.api = api;
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
