const assert = require("assert");
const readline = require("readline-sync");
const { Roku, App, Keys, discover } = require("../lib");

const testRequest = (req) =>
  req.then((res) =>
    assert.match(res.status.toString(), /2\d\d/, "Expected response status 200")
  );

const visualTest = async (title, test) => {
  it(title, async () => await test()).timeout(10000);
  it(`(wait) ${title}`, async (done) => {
    const input = readline.question(`\t(${title}) press enter to continue: `);
    assert.ok(!input, "Manual fail");
    done();
  }).timeout(30000);
};

const keyTest = (title, test) =>
  it(title, (done) => {
    test();
    setTimeout(done, 2500);
  }).timeout(7500);

let location;
let roku;
let appInfo;

describe("Local", () => {
  context("Setup", () => {
    it("discovery", async () => {
      const device = (await discover(3000))[0];
      ["address", "family", "port", "size", "usn", "location"].forEach((key) =>
        assert.ok(device[key])
      );
      location = device.location;
    }).timeout(5000);

    it("instance", () => (roku = new Roku(location)));
  });

  context("Query", () => {
    it("active-app", async () => assert.ok(await roku.activeApp()));
    it("apps", async () => {
      const apps = await roku.apps();
      assert.ok(apps);
      appInfo = apps.find((app) => app.id === 12);
    });
    it("device-info", async () => assert.ok(await roku.info()));
    it("media-player", async () => assert.ok(await roku.mediaPlayer()));
    it("tv-active-channel", async () => assert.ok(await roku.activeChannel()));
    it("tv-channels", async () => assert.ok(await roku.channels()));
  });

  context("App", () => {
    let netflix;

    it("instance", () => {
      netflix = new App(appInfo, roku);
      assert.match(netflix.toString(), /\[12\] Netflix \(v[\d.]+\)/);
    });

    visualTest("launch", () => testRequest(netflix.launch()));
    visualTest("input", () =>
      testRequest(netflix.input({ contentId: "70206978" }))
    );
    visualTest("store", () => testRequest(netflix.store()));
    visualTest("deep link", () =>
      testRequest(
        netflix.launch({ contentId: "70206978", mediaType: "series" })
      )
    );
  });

  context("Post", () => {
    visualTest("search", () => roku.search({ keyword: "ABC" }));
  });

  context("Keys", async () => {
    keyTest("type", () => {
      roku.press(Keys.BACKSPACE, Keys.BACKSPACE, Keys.BACKSPACE);
      roku.type("abc123");
    });

    keyTest("home", async () => {
      roku.press(Keys.HOME);
    });

    keyTest("hold", async () => {
      roku.keyDown(Keys.DOWN);
      roku.wait(2000);
      roku.keyUp(Keys.DOWN);
    });

    keyTest("power", () => {
      roku.press(Keys.POWEROFF);
      roku.wait(2000);
      roku.press(Keys.POWERON);
    });
  });
});
