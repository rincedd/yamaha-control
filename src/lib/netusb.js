// @flow
import EventEmitter from 'events';
import Api from './api';
import NotificationDispatcher from './notification-dispatcher';
import type {
  ExtendedPlaybackStatus, NetUsbChangeInfo, PlaybackInfo, SimplePlaybackInfo, SimpleResponse
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
}
