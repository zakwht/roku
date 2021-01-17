export interface LaunchOptions {
  contentId?: string;
  mediaType?:
    | "series"
    | "season"
    | "episode"
    | "movie"
    | "shortFormVideo"
    | "special"
    | "live";
}
