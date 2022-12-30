// @ts-nocheck
import Roku, { Keys } from "roku-ecp";

const [deviceInfo] = await Roku.discover();    
const myRoku = new Roku(deviceInfo.address);

const channels = await myRoku.channels();
if (!channels.some(c => c.name === "Netflix")) {
  myRoku.install(11);
}

myRoku.launch("dev", { 
  contentId: "3430755b-9afb-4bec-92ca-aa560a65a428",
  mediaType: "special" 
});

myRoku.press(Keys.UP, Keys.SELECT);
myRoku.wait(500);
myRoku.type("Search query...");

