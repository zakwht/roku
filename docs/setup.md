# Setup

## Installation
```
$ npm install --save roku-ecp
```

## Device Discovery

```typescript
import { discover } from "roku-ecp";

discover().then(console.log);
```
```json
[{
  "server": "Roku/9.3.0 UPnP/1.0 Roku/9.3.0",
  "address": "192.168.86.199",
  "location": "http://192.168.86.49:8060/",
  "usn": "uuid:roku:ecp:JQ0213HPHGRW"
}, {
  "server": "Roku/8.4.5 UPnP/1.0 Roku/8.4.5",
  "address": "192.168.86.65",
  "location": "http://192.168.86.23:8060/",
  "usn": "uuid:roku:ecp:YP34LOTR034G"
}]
```
Roku devices that are eligible for ECP will match the schema above. Specifically, the `server` will begin with `Roku/x.x.x` and the `location` will match `http://192.168.86.x:8060/`.

## Creating a Roku Class instance

```typescript
import { discover, SSDPDevice, Roku } from "roku-ecp";

// New instance from discovered devices:
const devices: SSDPDevice[] = await discover();
const myRoku = new Roku(devices[0].location)
// New instance from known device:
const myOtherRoku = new Roku("http://192.168.86.23:8060/")
```

See [Roku Class Api](/docs/api.md) for class methods.