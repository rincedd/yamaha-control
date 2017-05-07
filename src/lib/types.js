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
  input_list: string[],
  sound_program_list: string[],
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
