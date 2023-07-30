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

