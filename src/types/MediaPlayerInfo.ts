export interface MediaPlayerInfo {
  error: boolean;
  state: "play" | "open";
  plugin?: { bandwidth: string; id: string; name: string };
  format?: {
    audio: string;
    captions: string;
    container: string;
    drm: string;
    video: string;
    video_res: string;
  };
  buffering?: { current: number; max: number; target: number };
  new_stream?: { speed: string };
  position?: string;
  duration?: string;
  is_live?: boolean;
  runtime?: string;
  stream_segment?: {
    bitrate: number;
    media_sequence: number;
    segment_type: "mux";
    time: number;
  };
}
