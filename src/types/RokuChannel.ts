export interface RokuChannel {
  number: number;
  name: string;
  type: string;
  "user-hidden": boolean;
}

export interface RokuActiveChannel extends RokuChannel {
  "active-input": boolean;
  "signal-state": string;
  "signal-mode": string;
  "signal-quality": number;
  "signal-strength": number;
  "program-title": string;
  "program-description": string;
  "program-ratings": string;
  "program-analog-audio": string;
  "program-digital-audio": string;
  "program-audio-languages": string;
  "program-audio-formats": string;
  "program-audio-language": string;
  "program-audio-format": string;
  "program-has-cc": boolean;
}
