# This project is discontinued.

# Kimitzu Client

KIMITZU                    |  A Free Market for Services
:-------------------------:|:-------------------------:
![](./public/images/Logo/kimitzu-icon.png) | ![](./public/images/Logo/full-blue.png) 


This repository contains the client to be used with [Kimitzu-Go](https://github.com/kimitzu/kimitzu-go) and [Kimitzu-Services](https://github.com/kimitzu/kimitzu-services).

[![CircleCI](https://circleci.com/gh/kimitzu/kimitzu-client.svg?style=svg)](https://circleci.com/gh/kimitzu/kimitzu-client)

# Installation

## Snap

[![kimitzu-client](https://snapcraft.io//kimitzu-client/badge.svg)](https://snapcraft.io/kimitzu-client)
[![kimitzu-client](https://snapcraft.io//kimitzu-client/trending.svg?name=0)](https://snapcraft.io/kimitzu-client)

Install Kimitzu Client via Snap:

```
snap install --beta kimitzu-client
```

## Installation Files

Head over to our [release page](https://github.com/kimitzu/kimitzu-client/releases) to download the installers according to your platlform.

Tested on:
- Windows 10 Home (1903)
- MacOS (Mojave)
- Ubuntu 18.04.3

The installer contains `kimitzu-go` and `kimitzu-services` which will automatically run on the background when the client is launched.

# Building

Compile `kimitzu-go` and `kimitzu-services` first and copy the compiled binaries in the [lib](lib) folder.

Run `npm run build:local` to package the binaries and build the client depending on the operating system you use. 

Build files can be found on [./build](build).

Installation files can be found on [./dist](dist).

# Running

## Using standalone build files

> You need to run `kimitzu-go` and `kimitzu-services` prior to this.

Run `npm run serve`. This will host the client on port `3000`.

# Advanced

For users who want to host their Kimitzu instance remotely, see  [Installation Instructions for Advanced Users](INSTALL.md).

# Tests

Unit tests: `npm run react-test`

Automated UI tests: `npm run cypress:open`

# License

This project is licensed under the MIT License. You can view [LICENSE.MD](LICENSE) for more details.
