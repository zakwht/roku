# Roku Class API

## Relevant resources

- [Class source code](/src/roku.ts)
- [Type implementation](/src/types/)
- [Setup](/README.md#getting-started)
- [Roku docs](https://developer.roku.com/en-ca/docs/developer-program/debugging/external-control-api.md)

## Methods

- Simple
  - [discover](#discover)
  - [get](#get)
  - [post](#post)
  - [info](#info)
  - [mediaPlayer](#mediaplayer)
  - [search](#search)
- Apps
  - [apps](#apps)
  - [app](#app)
  - [activeApp](#activeApp)
  - [launch](#launch)
  - [install](#install)
  - [icon](#icon)
- Key actions
  - [press](#press)
  - [keyDown](#keydown)
  - [keyUp](#keyUp)
  - [type](#type)
  - [wait](*type)
- TV
  - [channels](#channels)
  - [activeChannel](#activeChannel)
  - [launchChannel](#launchChannel)
- Advanced input
  - [input](#input)
  - [sensor](#sensor)
  - [touch](#touch)

<div id="activeApp"></div>

### activeApp() ⇒ <code>Promise\<</code>[<code>RokuApp</code>](/src/types/RokuApp.ts)<code>\></code>

Retrieves information about the current application

<div id="activeChannel"></div>

### activeChannel() ⇒ <code>Promise\<</code>[<code>RokuActiveChannel</code>](/src/types/RokuChannel.ts)<code>\></code>

Retrieves information about the currently tuned TV channel. Restricted to Roku TV devices that support live TV

<div id="app"></div>

### app(appInfo) ⇒ <code>App</code>

Creates a new instance of the `App` class

| Param   | Type                                              | Description                   |
| ------- | ------------------------------------------------- | ----------------------------- |
| appInfo | [<code>RokuAppInfo</code>](/src/types/RokuApp.ts) | App information (id required) |

```typescript
const apps = await myRoku.apps();
const firstApp = myRoku.app(apps[0]);
const neflix = myRoku.app({ id: 12 });
```

<div id="apps"></div>

### apps() ⇒ <code>Promise\<</code>[<code>RokuApp</code>](/src/types/RokuApp.ts)<code>[]\></code>

Retrieves information about the device's applications

<div id="channels"></div>

### channels() ⇒ <code>Promise\<</code>[<code>RokuChannel</code>](/src/types/RokuChannel.ts)<code>[]\></code>

Retrieves information about the TV channel / line-up available for viewing in the TV tuner UI. Restricted to Roku TV devices that support live TV

<div id="discover"></div>

### static discover(timeout?) ⇒ <code>Promise\<</code>[<code>SSDPDevice</code>](/src/types/SSDPDevice.ts)<code>[]\></code>

Discovers local devices using SSDP. This is a **static** method

| Param   | Type                | Description                      |
| ------- | ------------------- | -------------------------------- |
| timeout | <code>number</code> | Timeout duration in milliseconds |

```typescript
const devices: SSDPDevice[] = await Roku.discover(5000);
console.log(devices);
```

<div id="get"></div>

### get(path, params?) ⇒ <code>Promise\<Response\></code>

Sends a GET request, with optional parameters

| Param  | Type                | Description        |
| ------ | ------------------- | ------------------ |
| path   | <code>string</code> | Request path URL   |
| params | <code>Object</code> | Request parameters |

<div id="icon"></div>

### icon(id) ⇒ <code>Promise\<Response\></code>

Returns an icon corresponding to the identified application

| Param | Type                | Description       |
| ----- | ------------------- | ----------------- |
| id    | <code>number</code> | The id of the app |

```typescript
const ws = createWriteStream(__dirname + "/out.png");
myRoku.icon(837).then((res) => res.body.pipe(ws)); // YouTube app icon
```

<div id="info"></div>

### info() ⇒ <code>Promise\<</code>[<code>RokuDevice</code>](/src/types/RokuDevice.ts)<code>\></code>

Retrieves information about the device

<div id="input"></div>

### input(options) ⇒ <code>Promise\<Response\></code>

Sends custom events to the current application

| Param   | Type                                                    | Description      |
| ------- | ------------------------------------------------------- | ---------------- |
| options | [<code>InputOptions</code>](/src/types/InputOptions.ts) | Input parameters |

<div id="install"></div>

### install(id) ⇒ <code>Promise\<Response\></code>

Exits the current channel, and launches the Channel Store details screen of the identified app.
| Param | Type | Description |
| ------ | ------------------- | ------------ |
| id | <code>id</code> | The app ID |

<div id="keyDown"></div>

### keyDown(key) ⇒ <code>Promise\<Response\></code>

Equivalent to pressing the identified remote control key

| Param | Type                                        | Description           |
| ----- | ------------------------------------------- | --------------------- |
| key   | [<code>Keys</code>](<(/src/types/Keys.ts)>) | The key to be pressed |

<div id="keyUp"></div>

### keyUp(key) ⇒ <code>Promise\<Response\></code>

Equivalent to releasing the identified remote control key

| Param | Type                                        | Description            |
| ----- | ------------------------------------------- | ---------------------- |
| key   | [<code>Keys</code>](<(/src/types/Keys.ts)>) | The key to be released |

<div id="launch"></div>

### launch(id, options?) ⇒ <code>Promise\<Response\></code>

Launches the identified app. Can accept launch parameters for deep linking

| Param   | Type                                                      | Description                          |
| ------- | --------------------------------------------------------- | ------------------------------------ |
| id      | <code>number\|"dev"</code>                                | The id of the app                    |
| options | [<code>LaunchOptions</code>](/src/types/LaunchOptions.ts) | Launch parameters (for deep linking) |

```typescript
// launch the dev channel:
myRoku.launch("dev");
// launch Netflix, loading a specific show:
myRoku.launch(12, { contentId: "70206978", mediaType: "series" });
```

<div id="launchChannel"></div>

### launchChannel(id) ⇒ <code>Promise\<Response\></code>

Launches the identified channel. Restricted to Roku TV devices that support live TV

| Param | Type                | Description        |
| ----- | ------------------- | ------------------ |
| id    | <code>number</code> | The channel number |

<div id="mediaPlayer"></div>

### mediaPlayer() ⇒ <code>Promise\<</code>[<code>MediaPlayerInfo</code>](/src/types/MediaPlayerInfo.ts)<code>\></code>

Retrieves information about the current stream segment and position of the content being played, the running time of the content, audio format, and buffering

<div id="post"></div>

### post(path, params?) ⇒ <code>Promise\<Response\></code>

Sends a POST request with no body, and optional parameters

| Param  | Type                | Description        |
| ------ | ------------------- | ------------------ |
| path   | <code>string</code> | Request path URL   |
| params | <code>Object</code> | Request parameters |

<div id="press"></div>

### press(...keys) ⇒ <code>void</code>

Equivalent to pressing down and releasing the identified remote control key. Can accept keyboard alphanumeric characters when a keyboard screen is active

| Param | Type                                                                              | Description                                      |
| ----- | --------------------------------------------------------------------------------- | ------------------------------------------------ |
| keys  | <code>(string\|</code>[<code>Keys</code>](<(/src/types/Keys.ts)>)<code>)[]</code> | An array of keys to press, or characters to type |

```typescript
const sequence: Keys[] = [Keys.DOWN, Keys.DOWN, Keys.RIGHT];
myRoku.press(...sequence);
```

<div id="search"></div>

### search(options) ⇒ <code>Promise\<Response\></code>

Enables an external client to drive the Roku Search UI to find and (optionally) launch content from an available provider

| Param   | Type                                                      | Description    |
| ------- | --------------------------------------------------------- | -------------- |
| options | [<code>SearchOptions</code>](/src/types/SearchOptions.ts) | Search options |

```typescript
myRoku.search({ keyword: "Game of Thrones" });
```

<div id="sensor"></div>

### sensor(input, values) ⇒ <code>Promise\<Response\></code>

Sends custom sensor events to the device
| Param | Type | Description |
| ------ | ------------------- | ------------ |
| input | [<code>SensorType</code>](/src/types/InputOptions.ts) | The sensor type |
| values | [<code>Dim3Values</code>](/src/types/InputOptions.ts) | The sensor input values |

<div id="touch"></div>

### touch(values, op?) ⇒ <code>Promise\<Response\></code>

Sends custom touch or multi-touch events to the device
| Param | Type | Description |
| ------ | ------------------- | ------------ |
| values | [<code>Dim2Values</code>](/src/types/InputOptions.ts) | The touch input values |
| op | [<code>TouchOp</code>](/src/types/InputOptions.ts) | The touch operation |

<div id="type"></div>

### type(input) ⇒ <code>void</code>

Types alphanumeric characters, provided a keyboard screen is active
| Param | Type | Description |
| ------ | ------------------- | ------------ |
| input | <code>string</code> | Text to be typed |

```typescript
myRoku.type("Phoebe Bridgers");
```

<div id="wait"></div>

### wait(ms) ⇒ <code>Promise\<boolean\></code>

Wait between key presses
| Param | Type | Description |
| ------ | ------------------- | ------------ |
| ms | <code>number</code> | Delay time in milliseconds |

```typescript
// hold the down button for two seconds:
myRoku.keyDown(Keys.DOWN);
myRoku.wait(2000);
myRoku.keyUp(Keys.DOWN);
```
