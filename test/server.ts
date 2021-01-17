import express from "express";
import Roku from "../src/roku";
import { readFileSync as read, existsSync as exists } from "fs";
import { join } from "path";
import assert from "assert";

const app = express();

app.get("/query/:route", (req, res) => {
  const path = join(process.cwd(), `test/fixtures/${req.params.route}.xml`);
  if (exists(path)) res.send(read(path, "utf8"));
  else res.status(404).send(`Cannot GET query/${req.params.route}`);
});

const server = app.listen(4060);

const testEquality = (actual: any, expected: typeof actual) => {
  typeof actual === "object"
    ? assert.deepStrictEqual(actual, expected, `${actual} != ${expected}`)
    : assert.strictEqual(actual, expected, `${actual} != ${expected}`);
};
const fixture = (name: string): {} => {
  const path = join(process.cwd(), `test/fixtures/${name}.json`);
  return JSON.parse(read(path, "utf8"));
};

const roku = new Roku("http://localhost:4060/");

describe("Fixtures", () => {
  context("Query", () => {
    it("active-app", async () =>
      testEquality(await roku.activeApp(), fixture("active-app")));
    it("apps", async () => testEquality(await roku.apps(), fixture("apps")));
    it("device-info", async () =>
      testEquality(await roku.info(), fixture("device-info")));
    it("media-player", async () =>
      testEquality(await roku.mediaPlayer(), fixture("media-player")));
    it("tv-active-channel", async () =>
      testEquality(await roku.activeChannel(), fixture("tv-active-channel")));
    it("tv-channels", async () =>
      testEquality(await roku.channels(), fixture("tv-channels")));
  });

  context("General", () => {
    it("toString", () => {
      testEquality(roku.toString(), "Roku (http://localhost:4060/)");
      const netflix = roku.app(fixture("active-app") as any);
      testEquality(netflix.toString(), "[12] Netflix (v5.0.98079409)");
    });
  });

  after(() => server.close());
});
