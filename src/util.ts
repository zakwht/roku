import { Client as SSDP } from "node-ssdp";
import { SSDPDevice } from "./types";

export const queryString = (params?: {}) => {
  if (!params) return "";
  return (
    "?" +
    Object.keys(params)
      .map((key) => `${encodeURI(key)}=${encodeURI(params[key])}`)
      .join("&")
  );
};

export const parse = <T>(obj: {}): T => {
  let c = {};
  if (obj["_attributes"])
    Object.entries(obj["_attributes"]).forEach(
      ([key, value]: [string, string]) => (c[key] = cast(value))
    );
  Object.entries(obj).forEach(([key, value]: [string, string]) => {
    if (value["_text"]) return (c[key] = cast(value["_text"]));
    if (value["_attributes"]) return (c[key] = parse(value["_attributes"]));
    c[key.replace("_text", "name")] = cast(value);
  });
  delete c["_attributes"];
  return c as T;
};

const cast = (val: string): string | boolean | number => {
  if (val === "true") return true;
  if (val === "false") return false;
  if (!Number.isNaN(Number(val))) return Number(val);
  return val;
};

export const discover = (timeout: number = 10000): Promise<SSDPDevice[]> => {
  const ssdp = new SSDP();
  const devices: SSDPDevice[] = [];

  ssdp.on("response", (headers, _, rinfo) =>
    devices.push({ ...rinfo, usn: headers.USN, location: headers.LOCATION })
  );
  ssdp.search("roku:ecp");

  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(devices);
      ssdp.stop();
    }, timeout)
  );
};
