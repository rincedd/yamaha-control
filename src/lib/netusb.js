// @flow
import EventEmitter from 'events';
import Api from './api';
import NotificationDispatcher from './notification-dispatcher';
import type {
  ExtendedPlaybackStatus, InputID, ListControlAction, ListInfo, NetUsbChangeInfo, PlaybackInfo,
  PresetInfo, PresetItemInfo, SimplePlaybackInfo, SimpleResponse, ZoneID,
} from './types';

export default class NetUsb extends EventEmitter {
  api: Api;

  constructor(api: Api, dispatcher: NotificationDispatcher) {
    super();
    this.api = api;
    dispatcher.on('change:netusb', (event: NetUsbChangeInfo) => {
      if (event.play_info_updated) {
        this.getCurrentlyPlaying().then((playbackInfo: SimplePlaybackInfo) => this.emit('change:currentlyplaying', playbackInfo));
      }
    });
  }

  getPlaybackInfo(): Promise<PlaybackInfo> {
    return this.api.get('netusb/getPlayInfo');
  }

  async getCurrentlyPlaying(): Promise<SimplePlaybackInfo> {
    const playbackInfo: PlaybackInfo = await this.getPlaybackInfo();
    return {
      artist: playbackInfo.artist,
      album: playbackInfo.album,
      track: playbackInfo.track,
      albumArt: playbackInfo.albumart_url ? `http://${this.api.ip}${playbackInfo.albumart_url}` : '',
    };
  }

  setPlayback(status: ExtendedPlaybackStatus): Promise<SimpleResponse> {
    return this.api.get(`netusb/setPlayback?playback=${status}`);
  }

  pause(): Promise<SimpleResponse> {
    return this.setPlayback('pause');
  }

  play(): Promise<SimpleResponse> {
    return this.setPlayback('play');
  }

  togglePause(): Promise<SimpleResponse> {
    return this.setPlayback('play_pause');
  }

  stop(): Promise<SimpleResponse> {
    return this.setPlayback('stop');
  }

  getListInfo(input: InputID, index: number): Promise<ListInfo> {
    return this.api.get(`netusb/getListInfo?input=${input}&index=${index}&size=8&lang=en`);
  }

  setListControl(input: InputID, type: ListControlAction, index: number): Promise<SimpleResponse> {
    return this.api.get(`netusb/setListControl?input=${input}&type=${type}&index=${index}`);
  }

  async getPresets(): Promise<PresetItemInfo[]> {
    const presetInfo: PresetInfo = await this.api.get('netusb/getPresetInfo');
    return presetInfo.preset_info.filter((preset: PresetItemInfo) => preset.input !== 'unknown');
  }

  selectPreset(zone: ZoneID, index: number): Promise<SimpleResponse> {
    return this.api.get(`netusb/recallPreset?zone=${zone}&num=${index}`);
  }
}
