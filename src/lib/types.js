// @flow
export type ZoneID = 'main' | 'zone2' | 'zone3' | 'zone4';
export type InputID = 'cd' | 'tuner' | 'multi_ch' | 'phono' | 'hdmi1' | 'hdmi2' | 'hdmi3' | 'hdmi4' | 'hdmi5' | 'hdmi6'
  | 'hdmi7' | 'hdmi8' | 'hdmi' | 'av1' | 'av2' | 'av3' | 'av4' | 'av5' | 'av6' | 'av7' | 'v_aux' | 'aux1' | 'aux2'
  | 'aux' | 'audio1' | 'audio2' | 'audio3' | 'audio4' | 'audio_cd' | 'audio' | 'optical1' | 'optical2' | 'optical'
  | 'coaxial1' | 'coaxial2' | 'coaxial' | 'digital1' | 'digital2' | 'digital' | 'line1' | 'line2' | 'line3' | 'line_cd'
  | 'analog' | 'tv' | 'bd_dvd' | 'usb_dac' | 'usb' | 'bluetooth' | 'server' | 'net_radio' | 'rhapsody' | 'napster'
  | 'pandora' | 'siriusxm' | 'spotify' | 'juke' | 'airplay' | 'radiko' | 'qobuz' | 'mc_link' | 'main_sync' | 'none';
export type SoundProgramID = 'munich_a' | 'munich_b' | 'munich' | 'frankfurt' | 'stuttgart' | 'vienna' | 'amsterdam'
  | 'usa_a' | 'usa_b' | 'tokyo' | 'freiburg' | 'royaumont' | 'chamber' | 'concert' | 'village_gate' | 'village_vanguard'
  | 'warehouse_loft' | 'cellar_club' | 'jazz_club' | 'roxy_theatre' | 'bottom_line' | 'arena' | 'sports' | 'action_game'
  | 'roleplaying_game' | 'game' | 'music_video' | 'music' | 'recital_opera' | 'pavilion' | 'disco' | 'standard'
  | 'spectacle' | 'sci-fi' | 'adventure' | 'drama' | 'talk_show' | 'tv_program' | 'mono_movie' | 'movie' | 'enhanced'
  | '2ch_stereo' | '5ch_stereo' | '7ch_stereo' | '9ch_stereo' | '11ch_stereo' | 'stereo' | 'surr_decoder'
  | 'my_surround' | 'target' | 'straight' | 'off';

export type PowerStatus = 'on' | 'standby';

export type SimpleResponse = {
  response_code: number
};

export type DeviceInfo = {
  response_code: number,
  model_name: string,
  destination: string,
  device_id: string,
  system_version: number,
  api_version: number,
  netmodule_version: string,
  netmodule_checksum: string,
  operation_mode: string,
  update_error_code?: string,
  update_progress?: Object
};

export type SystemInfo = {};
export type TunerInfo = {};
export type NetUsbInfo = {};
export type RangeStepInfo = {
  id: string,
  min: number,
  max: number,
  step: number
};
export type ZoneInfo = {
  id: ZoneID,
  zone_b: boolean,
  func_list: string[],
  input_list: InputID[],
  sound_program_list: SoundProgramID[],
  tone_control_mode_list: string[],
  equalizer_mode_list: string[],
  link_control_list: string[],
  link_audio_delay_list: string[],
  range_step: RangeStepInfo[]
};

export type FeatureInfo = {
  response_code: number,
  system: SystemInfo,
  zone: ZoneInfo[],
  tuner: TunerInfo,
  netusb: NetUsbInfo,
  distribution: Object,
  clock: Object,
};
export type ToneControlStatus = {
  mode: string,
  bass: number,
  treble: number
};

export type ZoneStatus = {
  response_code: number,
  power: PowerStatus,
  sleep: 0 | 30 | 60 | 90 | 120,
  volume: number,
  mute: boolean,
  input: InputID,
  sound_program: string,
  surround_3d: boolean,
  direct: boolean,
  pure_direct: boolean,
  enhancer: boolean,
  tone_control: ToneControlStatus
};

export type PlaybackStatus = 'play' | 'stop' | 'pause' | 'fast_reverse' | 'fast_forward';
export type ExtendedPlaybackStatus = 'play' | 'stop' | 'pause' | 'play_pause' | 'previous' | 'next'
  | 'fast_reverse_start' | 'fast_reverse_end' | 'fast_forward_start' | 'fast_forward_end';

export type PlaybackInfo = {
  response_code: number,
  input: InputID,
  play_queue_type: string,
  playback: PlaybackStatus,
  repeat: 'off' | 'one' | 'all',
  shuffle: 'off' | 'on' | 'songs' | 'albums',
  play_time: number,
  total_time: number,
  artist: string,
  album: string,
  track: string,
  albumart_url: string,
  albumart_id: number,
  usb_devicetype: 'msc' | 'ipod' | 'unknown',
  auto_stopped: boolean,
  attribute: number
};

export type SimplePlaybackInfo = {
  artist: string,
  album: string,
  track: string,
  albumArt: string,
};

export type ZoneChangeInfo = {
  power?: PowerStatus,
  input?: InputID,
  volume?: number,
  mute?: boolean,
  status_updated?: boolean,
  signal_info_updated?: boolean
};
export type SystemChangeInfo = {
  bluetooth_info_updated?: boolean,
  func_status_updated?: boolean,
  speaker_settings_updated?: boolean,
  name_text_updated?: boolean,
  tag_updated?: boolean,
  location_info_updated?: boolean,
  stereo_pair_info_updated?: boolean
};
export type NetUsbChangeInfo = {
  play_error?: number,
  multiple_play_errors?: number,
  play_message?: string,
  account_updated?: boolean,
  play_time?: number,
  preset_info_updated?: boolean,
  recent_info_updated?: boolean,
  preset_control?: {
    type: string,
    num: number,
    result: string
  },
  trial_status?: {
    input: InputID,
    enable: boolean
  },
  trial_time_left?: {
    input: InputID,
    time: number
  },
  play_info_updated?: boolean,
  list_info_updated?: boolean
};
export type StatusChangeEvent = {
  device_id: ?string,
  system?: SystemChangeInfo,
  main?: ZoneChangeInfo,
  zone2?: ZoneChangeInfo,
  zone3?: ZoneChangeInfo,
  zone4?: ZoneChangeInfo,
  netusb?: NetUsbChangeInfo
};

export type SignalInfo = {
  response_code: number,
  audio: {
    error: number,
    format: string,
    fs: string
  }
}

export type ListItemInfo = {
  text: string,
  thumbnail: string,
  attribute: number
};

export type ListInfo = {
  response_code: number,
  input: InputID,
  menu_layer: number,
  max_line: number,
  index: number,
  playing_index: number,
  menu_name: string,
  list_info: ListItemInfo[]
};

export type ListControlAction = 'select' | 'play' | 'return';
