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
  new_stream?: { speed: "128000 bps" };
  position?: "6916 ms";
  duration?: "887999 ms";
  is_live?: boolean;
  runtime?: "887999 ms";
  stream_segment?: {
    bitrate: number;
    media_sequence: number;
    segment_type: "mux";
    time: number;
  };
}
