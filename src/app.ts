import { Roku } from "./roku";
import { InputOptions, LaunchOptions, RokuAppInfo } from "./types";
import { queryString } from "./util";

export class App {
  // instance members
  appInfo: RokuAppInfo;
  private get: (path: string, params?: {}) => Promise<Response>;
  private post: (path: string, params?: {}) => Promise<Response>;
  toString = () =>
    `[${this.appInfo.id}]${this.appInfo.name ? ` ${this.appInfo.name}` : ""}${
      this.appInfo.version ? ` (v${this.appInfo.version})` : ""
    }`;

  /**
   * Initializes a new App given its id and parent device
   * @param {{}} appInfo App details (id required)
   * @param {Roku} parent Parent device
   */
  constructor(appInfo: RokuAppInfo, parent: Roku) {
    this.appInfo = appInfo;
    this.get = (path: string, params?: {}) =>
      fetch(`${parent.location}${path}${queryString(params)}`);
    this.post = (path: string, params?: {}) =>
      fetch(`${parent.location}${path}${queryString(params)}`, {
        method: "post"
      });
  }

  /**
   * Returns an icon corresponding to the application
   */
  icon = () => this.get(`query/icon/${this.appInfo.id}`);

  /**
   * Launches the app. Can accept launch parameters for deep linking.
   * @param {{}} options Launch parameters (for deep linking)
   */
  launch = (options?: LaunchOptions) =>
    this.post(`launch/${this.appInfo.id}`, options);

  /**
   * Exits the current channel, and launches the Channel Store details screen of the app.
   */
  store = () => this.post("launch/11", { contentId: this.appInfo.id });

  /**
   * Exits the current channel, and launches the Channel Store details screen of the app (provided the app is not installed).
   */
  install = () => this.post(`install/${this.appInfo.id}`);

  /**
   * Sends custom events to the current application
   * @param {{}} options Input parameters
   */
  input = (options: InputOptions) => this.post("input", options);
}
