import { LaunchOptions } from "./LaunchOptions";

export interface Dim2Values {
  x?: number;
  y?: number;
}

export interface Dim3Values extends Dim2Values {
  z?: number;
}

export type SensorType =
  | "acceleration"
  | "orientation"
  | "rotation"
  | "magnetic";

export type TouchOp = "up" | "down" | "press" | "move" | "cancel";

export interface InputOptions extends LaunchOptions {
  "acceleration.x"?: number;
  "acceleration.y"?: number;
  "acceleration.z"?: number;
  "orientation.x"?: number;
  "orientation.y"?: number;
  "orientation.z"?: number;
  "rotation.x"?: number;
  "rotation.y"?: number;
  "rotation.z"?: number;
  "magnetic.x"?: number;
  "magnetic.y"?: number;
  "magnetic.z"?: number;
  "touch.0.x"?: number;
  "touch.0.y"?: number;
  "touch.0.op"?: TouchOp;
  [key: string]: string | number;
}
