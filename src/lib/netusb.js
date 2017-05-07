// @flow
import Api from './api';
import type { ExtendedPlaybackStatus, PlaybackInfo, SimplePlaybackInfo, SimpleResponse } from './types';

export default class NetUsb {
  api: Api;

  constructor(api: Api) {
    this.api = api;
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
      albumArt: `http://${this.api.ip}${playbackInfo.albumart_url}`,
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
