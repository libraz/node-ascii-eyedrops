# node-ascii-eyedrops

[![CI](https://img.shields.io/github/actions/workflow/status/libraz/node-ascii-eyedrops/ci.yml?branch=main&label=CI)](https://github.com/libraz/node-ascii-eyedrops/actions)
[![codecov](https://codecov.io/gh/libraz/node-ascii-eyedrops/graph/badge.svg)](https://codecov.io/gh/libraz/node-ascii-eyedrops)
[![npm](https://img.shields.io/npm/v/@libraz/ascii-eyedrops)](https://www.npmjs.com/package/@libraz/ascii-eyedrops)
[![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/libraz/node-ascii-eyedrops/blob/main/LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D16-green?logo=node.js)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/platform-Node.js%20%7C%20Browser-lightgrey)](https://github.com/libraz/node-ascii-eyedrops)

**True Visual Programming for JavaScript.**

The software industry has mass-produced tools to make code "readable."
Prettier. ESLint. EditorConfig. Entire careers have been devoted to the
noble cause of making source code look like every other source code.

This is a tragic misallocation of engineering talent.

In 2001, [Acme::EyeDrops](https://metacpan.org/pod/Acme::EyeDrops) proved
this conclusively by converting Perl programs into ASCII art — executable
ASCII art. The programs still ran. They just happened to look like camels.
The world was not ready.

The world is still not ready. But here we are.

`@libraz/ascii-eyedrops` brings this breakthrough to JavaScript. When people say
"visual programming," they mean drag-and-drop blocks and flowchart editors.
They are, respectfully, parsing the wrong abstraction.
**The code _is_ the art. You run the art.**

## Before & After

This:

```javascript
console.log("You my hero, Elon.");
```

Becomes this:

```javascript
var $_=""/*-------------------------------~--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*///
;$_+="-------------------------------------~--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Y29"//
;$_+="------------------------------------------~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"//
;$_+="-------------------------------------------~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"//
;$_+="----------------------------------------------~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"//
;$_+="------------------------------------------------~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"//
;$_+="-----------------------------------------~-~~~~~~~~~---~~~~~~~~~~~~~~~~~~~~~~~~u"//
;$_+="----------------------------------~~~~~~~c29~~sZS~~~~5~~~~~~~~~~~~~~~~~~~~~~~~~s"//
;$_+="-------------------------------~~b2~~~coIllvdSBteS~~~BoZXJ~~~~~~~~~~~~~~~~~~~~~v"//
;$_+="-----------------------------~LCB~~~F~~bG9uLiIp!!!!!~~~~~!!!!!~~~~~~~~~~~~~~~~~!"//
;$_+="----------------------------~~!~~~~!!!*******!!!!!!!!!!!~~!!!!!!~~~~~~~~~~~~~~~!"//
;$_+="---------------------------~~!!!~~-~~~~!!*************!!!!*!!!!!!!~~~~~~~~~~~~~!"//
;$_+="---------------------------~!!~~------------~~~~~~!!!!!********!!!!~~~~~~~~~~~~!"//
;$_+="-------------------------~~!!~~--~~--------------------~~!!!!**#**!!~~~~~~~~~~~!"//
;$_+="-------------------------~~!!~~-~~~----------------------~~~~~~!****!~~~~~~~~~~*"//
;$_+="------------------------~~!~~~~-~~~---------------------~~~~~~~~~!***!~~~~~~~~~*"//
;$_+="------------------------~~~~~~~--------------------------~~~~~~~~!!!**!~~~~~~~~*"//
;$_+="------------------------~~~~~~-----------------------------~~~~~~~!!!***~~~~~~~*"//
;$_+="-----------------------~~!!~---~---------------------------~~~~~~~!*****!~~~~~~*"//
;$_+="----------------------~!~!!--~~----------------------------~~~~~~~!*#***!~~~~~~*"//
;$_+="--------------------~~-~~!!-----------~~~~~~---------------~~~~~!!!!****!~~~~~~*"//
;$_+="-------------------~~!~-~!~-~--------~~~~~~!!!!~------------~~~~~!!!!!**!~~~~~~#"//
;$_+="-------------------~-~~~~~----------------~-~~~~~--------~~~~!!!!!!!!!!*!~~~~~~#"//
;$_+="--------------------~~-~---------------~~~!!~~~~~~-----~~!!~!!!!**!!!!!!~~~~~~~#"//
;$_+="--------------------!~-~~~---------------~~~~-~~~~----!!!~!!!!~!!!!!!!!~~~~~~~~#"//
;$_+="--------------------~~~~~-~--------------------~--~--~~~~~~!!!!*!!!!!!~~~~~~~~!#"//
;$_+="---------------------~--~------------------~~~---~~~-~~--~~~~~!!!!!!!!~~~~~~~~!#"//
;$_+="----------------------~~~~----------------------~~~~-~~---~~~~~~~~!!!!!~~~~~~~!*"//
;$_+="-----------------------~~~----~-----------------~~~~~~~----~~~~~~~~~!!~~~~~~~~!*"//
;$_+="-----------------------~~~--------------------~~~~--~~~----~~~~!!!~!!!~~~~~~~~!*"//
;$_+="-----------------------~~~----~--~------------~~!!~~!!~---~~~~!!!!!!!~~~~~~~~~**"//
;$_+="----------------------~~---~--~--~~-------------~~~!!~~--~~~~!!!!!!!!~~~~~~~~~**"//
;$_+="----------------------~~~------------------------~-~~---~~~~~!!!!!!!~~~~~~~~~~**"//
;$_+="-----------------------~~~~---------------------~~~~~---~~~~~!!!!!!~~~~~~~~~~~**"//
;$_+="------------------------~~~~~-----~-----~~~~~~~~~~~~~~~~~~~~!!~!!!!~~~~~~~~~~~**"//
;$_+="-----------------------~~!!!~~----~~----~~~~~~~~~~~~!!~~~~~!*~!!!!~~~~~~~~~~~~**"//
;$_+="---------------------~!!*!!!!~~~---~---------~~~~~~~~~~~~~!!~~!!*!~~~~~~~~~~~~**"//
;$_+="--------------------~!!!*!!!!!!!~---~~---------~~~~~~~~~~!!~!**#***!~~~~~~~~!~#*"//
;$_+="-------------------~!~~!!!!~!!!*!!~~!!~~~~~~~~~~~~~~~~~~!!!*###*#**#**!~~~~~!~#*"//
;$_+="--------------~~~~~~~~~~~~~~~~~!!***!!!!!!~~~~~~~~~~!!!!***#************!!~~~!#*"//
;$_+="----------~~~~~~~~~~!~~~~~~~~~~~~!!****!!!!!!!!!!!!****######*******!!**!!!!!!#*"//
;$_+="-----~~~~~~~~~~~~~~~!!~~~~~~~!~~~~~!!!****!!!!*******#####***!!!*!!!!!!!!**!!!#*"//
;$_+="-~~~~~~~~~~~~~~~~~~~!!~~~~~~~~!~~~~~~~~!!********#####***!!!!~!!!!!!!!*!****!!#*"//
;$_+="~~~~~~~~~~~~~~~~~~~~~!!~~~!~!!~~~~~~~~~~~~!************!!~~~~!!!!!!!!!!!*!!!!*#*"//
;$_+="~~~~~~~~~~~~~~~~~~~~~!!!!!!!!!!!~~~~~~~~~~~!**!!!!~~~!!~~!!!!!!!!!!!!*!**!!!!*#*"//
;$_+="~~~~~~~~~~~~~~~~~~~!~~~!!!~!!!!~!!!!!~~~~~~~!!~~~~~~~!!!!!!*!!!!!!!!!!!!!!!!!*#*"//
;$_+="~!!~~~~~~~~!~~~~~~~!~~!~!~~~!!!!~~~~~~~!!!!!!!!!!!!!!!!!!!*!!!!!!!!!**!!!!!!!*#*"//
;$_+="!!!!~~~~~~~!!~!~~~~~!~!!!!!~~~!*~!!!!!!!!!!!!!!!!!!!!!!!!!!!*!!!!!***!*!!!!!!*#*"//
;$_+="!!!!~~~~~~~!!!!~~~~~~!!!!!!!!!!!!!!!!!!!!*!!!**!!!!!!!!!!!!!!!!!!***!*!!!!!!!*#*"//
;$_+="!!!!!~~~~~~~~!!!~~~~~~!!!!!!!!!!*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*!!!!!!!!*#*"//
;$_+="~!!!~~~~~~~~!~!!!!!~~~~!!!!!*!!!!*!!!!!!!!!!!!!!!!!!!!**!!!!!!!!!!!**!!!!!!!!*##"//
;$_+="~~!!~~~~~~~~~~!!!~~!~!!!!!!!!!!!!!!!!!~~~~!!!!!!!!!!***!!!!!!!!!!!**!*!!!!!!!*@@"//
;$_+="~~~~~~~~~~~~~~~~~~~~~~~~~!*!!!!!!!!!*!!!~!!!!!!!**!!!!!!!!!!!!!!!!*!!!!!!!!!!#%@"//
;$_+="~~~~~~~~~~~~~~~~~~~~~~~~~~!*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*!!!!*!!***!#@@"//
;eval(atob($_.replace(/[^A-Za-z0-9+\/=]/g,"")))/*!!!!!!!!!!!!!!!!!!!!!!!!*!!!!*!!!****///
```

**It's art now.**

## Installation

```bash
# yarn
yarn add @libraz/ascii-eyedrops

# npm
npm install @libraz/ascii-eyedrops
```


## Usage

### Transform code into ASCII art

```javascript
import { transform } from "@libraz/ascii-eyedrops";

const code = 'console.log("Hello, world!")';

// Binary mode: dark pixels = code chars, light pixels = spaces
const binaryArt = await transform(code, {
  image: "./elon.png",
  mode: "binary",
});

// Shaded mode: all cells filled, varying character density for gradients
const shadedArt = await transform(code, {
  image: "./elon.png",
  mode: "shaded",
});

// Both outputs are valid JavaScript:
eval(binaryArt); // prints "Hello, world!"
eval(shadedArt); // prints "Hello, world!"
```

### Standalone ASCII art generation

```javascript
import { imageToAscii } from "@libraz/ascii-eyedrops";

const art = await imageToAscii("./photo.jpg", {
  width: 120,
  charset: " .:-=+*#%@",
});

console.log(art);
```

## API

### `transform(code, options)`

Transform JavaScript code into executable ASCII art.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `image` | `string \| Uint8Array` | *required* | Source image — JPEG, PNG, WebP, GIF, AVIF, TIFF (path or binary) |
| `mode` | `"binary" \| "shaded"` | `"binary"` | Layout mode |
| `compress` | `boolean` | `true` | Minify code via terser |
| `gzip` | `boolean` | `false` | Gzip compress before encoding |
| `ascii.width` | `number` | `120` | Output width in characters |
| `ascii.height` | `number` | *auto* | Output height in rows |
| `ascii.threshold` | `number` | `128` | Dark/light binarization threshold (0-255) |
| `ascii.invert` | `boolean` | `false` | Invert light/dark mapping |
| `ascii.contrast` | `number` | `1` | Contrast adjustment (0-2) |
| `ascii.brightness` | `number` | `1` | Brightness adjustment (0-2) |
| `ascii.gamma` | `number` | `1` | Gamma correction |
| `ascii.dither` | `boolean` | `false` | Floyd-Steinberg dithering |

### `imageToAscii(input, options?)`

Generate traditional ASCII art from an image.

Accepts the same `ascii.*` options as `transform`, plus:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `charset` | `string` | `" .:-=+*#%@"` | Characters ordered light to dark |

## Layout Modes

### Binary

The classic Acme::EyeDrops approach. Dark image regions are filled with
base64 payload characters; light regions become spaces. The result is a
code silhouette — recognizable shapes emerging from the code itself.

Enable `dither: true` for detailed images to preserve fine structure.

### Shaded

Every cell is filled with a character. Dark regions receive payload characters
(A-Za-z0-9); light regions receive non-base64 filler characters (`. : - ~ ! * # @ %`)
of varying visual weight. This produces smooth grayscale gradients, ideal for
photographs and detailed images.

All filler characters are stripped during decode via regex, leaving only the
original base64 payload.


## Requirements

- **Node.js** >= 16
- **sharp** (optional) — image decoding in Node.js (JPEG, PNG, WebP, GIF, AVIF, TIFF)
- **terser** (optional) — for code minification
- **Browser** — uses Canvas API for image decoding

## License

MIT
