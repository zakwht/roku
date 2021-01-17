export interface SearchOptions {
  keyword: string;
  title?: string;
  type?: "movie" | "tv-show" | "person" | "channel" | "game";
  tmsid?: string;
  season?: number;
  "show-unavailable"?: boolean;
  "match-any"?: boolean;
  "provider-id"?: number;
  provider?: string;
  launch?: boolean;
}
