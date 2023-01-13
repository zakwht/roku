import { Dim2Values, Dim3Values, InputOptions, Keys, LaunchOptions, MediaPlayerInfo, RokuActiveChannel, RokuApp, RokuAppInfo, RokuChannel, RokuDevice, SearchOptions, SensorType, TouchOp } from "./types";
import { xml2js } from "xml-js";
import { Response as NodeResponse } from "node-fetch";
import { discover, parse, queryString, fetch } from "./util";
import { App } from "./app";

export class Roku {
  // static members
  static discover = discover;
  static keys = Keys;

  // instance members
  location: string; //the location
  private queue: (() => Promise<Response | NodeResponse>)[] = [];
  private processing: boolean = false;
  toString = () => `Roku (${this.location})`;

  // sequentially execute keypresses
  private execute = async (recursing?: boolean, cmd?: () => Promise<any>) => {
    if (cmd) this.queue.push(cmd);
    if (!recursing && this.processing) return;
    if (!this.queue.length) return this.processing = false;
    this.processing = true;
    this.queue.shift()().then(() => this.execute(true));
  }

  /**
   * Initializes a new Roku given its location
   * @param {string} location The URL of the device
   */
  constructor(location: string) {
    // if (!location) throw "No location provided" // -> regex should match http://*:8060 | empty
    this.location = location;
  }

  /**
   * Sends a GET request
   * @param {string} path Request URL
   * @param {{}} params Request parameters
   */
  get = (path: string, params?: {}) => 
    fetch(`${this.location}${path}${queryString(params)}`);

  /**
   * Sends a POST request with no body
   * @param {string} path Request URL
   * @param {{}} params Request parameters
   */
  post = (path: string, params?: {}) => fetch(`${this.location}${path}${queryString(params)}`, {method: "post"});

  /**
   * Enables an external client to drive the Roku Search UI to find and (optionally) launch content from an available provider.
   * @param {{}} options Search parameters (keyword required)
   */
  search = (options: SearchOptions) => this.post("search/browse", options);

  /**
   * Equivalent to pressing down and releasing the identified remote control key. Can accept keyboard alphanumeric characters when a keyboard screen is active (see type)
   * @param {string[]} keys A list of keys to press
   */
  press = (...keys: (Keys | string)[]) => {
    keys.forEach(key => {
      const literalKey = Object.keys(Keys).includes(key.toUpperCase()) ? key : `LIT_${key}`;
      this.execute(false, () => this.post(`keypress/${literalKey}`));
    })
  }

  /**
   * Equivalent to pressing the identified remote control key
   * @param {string} key Key to be pressed (case insensitive)
   */
  keyDown = (key: Keys) => this.post(`keydown/${key}`);

  /**
   * Equivalent to releasing the identified remote control key
   * @param {string} key Key to be released (case insensitive)
   */
  keyUp = (key: Keys) => this.post(`keyup/${key}`);
  
  /**
   * Launches the identified channel. Can accept launch parameters for deep linking.
   * @param {number} id The id of the app
   * @param {{}} options Launch parameters (for deep linking)
   */
  launch = (id: number | "dev", options?: LaunchOptions) => this.post(`launch/${id}`, options);
 
  /**
   * Sends custom events to the current application
   * @param {{}} options Input parameters
   */
  input = (options: InputOptions) => this.post("input", options);

  /**
   * Retrieves information about the device
   * @returns {{}} Device details
   */
  info = (): Promise<RokuDevice> => this.get("query/device-info").then(res => res.text()).then(xml => parse<RokuDevice>(xml2js(xml, {compact: true})["device-info"]));
  
  /**
   * Retrieves information about the current application
   * @returns {{}} App details
   */ 
  activeApp = (): Promise<RokuApp> => this.get("query/active-app").then(res => res.text()).then(xml => parse<RokuApp>(xml2js(xml, {compact: true})["active-app"]["app"]));
  
  /**
   * Retrieves information about the device's applications
   * @returns {{}[]} An array of app details
   */
  apps = (): Promise<RokuApp[]> => this.get("query/apps").then(res => res.text()).then(xml => xml2js(xml, {compact: true})["apps"]["app"].map(parse));
  
  /**
   * Retrieves information about the currently tuned TV channel
   * @remarks Restricted to Roku TV devices that support live TV
   * @returns {{}} Channel details
   */
  activeChannel = (): Promise<RokuActiveChannel> => this.get("query/tv-active-channel").then(res => res.text()).then(xml => parse<RokuActiveChannel>(xml2js(xml, {compact: true})["tv-channel"]["channel"]));
  
  /**
   * Retrieves information about the TV channel / line-up available for viewing in the TV tuner UI
   * @remarks Restricted to Roku TV devices that support live TV
   * @returns {{}[]} An array of channel details
   */
  channels = (): Promise<RokuChannel[]> => this.get("query/tv-channels").then(res => res.text()).then(xml => {
    const parsed = xml2js(xml, {compact: true})["tv-channels"];
    if (parsed["channel"]) return parsed["channel"].map(parse);
    return [];
  })

  /**
   * Retrieves information about the currently tuned TV channel
   * @remarks Restricted to Roku TV devices that support live TV
   * @param {number} id The channel number
   */
  launchChannel = (id: number) => this.post("launch/tvinput.dtv", {ch: id});

  /**
   * Wait between key presses
   * @param {number} ms Delay time in milliseconds
   */
  wait = (ms: number) => this.execute(false, () => new Promise((resolve) => setTimeout(resolve, ms)))
  
  /**
   * Exits the current channel, and launches the Channel Store details screen of the identified app.
   * @param {number} id The id of the app
   */
  install = (id: number) => this.post(`install/${id}`);

  /**
   * Types alphanumeric characters, provided a keyboard screen is active
   * @param {string} input Text to be typed
   */
  type = (input: string) => input.split("").forEach(char => this.press(char));
  
  /**
   * Sends custom sensor events to the device
   * @param {"acceleration" | "orientation" | "rotation" | "magnetic"} input The sensor type
   * @param {{x: number, y: number, z: number}} values The sensor input values
   */
  sensor = (input: SensorType, values: Dim3Values) => {
    const params = {};
    Object.keys(values).forEach(key => params[`${input}.${key}`] = values[key]);
    this.input(params);
  }

  /**
   * Sends custom touch or multi-touch events to the device
   * @param {{x: number, y: number}} values The touch input values
   * @param {"up" | "down" | "press" | "move" | "cancel"} op The touch operation
   */
  touch = (values: Dim2Values, op?: TouchOp) => {
    const params = op ? {"touch.0.op": op} : {};
    Object.keys(values).forEach(key => params[`touch.0.${key}`] = values[key]);
    console.log(params);
  }

  /**
   * Creates a new instance of the `App` class
   * @param {{}} appInfo App information (id required)
   * @returns {App} The new App
   */
  app = (appInfo: RokuAppInfo): App => new App(appInfo, this);

  /**
   * Returns an icon corresponding to the identified application
   * @param {number} id The id of the app
   */
  icon = (id: number) => this.get(`query/icon/${id}`);

  /**
   * Retrieves information about the current stream segment and position of the content being played, the running time of the content, audio format, and buffering
   * @returns {{}} Media player details
   */
  mediaPlayer = (): Promise<MediaPlayerInfo> => this.get("query/media-player").then(res => res.text()).then(xml => parse(xml2js(xml, {compact: true})["player"]));  
}

