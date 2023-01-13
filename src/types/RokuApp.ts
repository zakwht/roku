export interface RokuApp {
  name: string;
  id: number;
  type: "appl" | "tvin";
  version: string;
}

export type RokuAppInfo = Partial<RokuApp> & { id: number };
