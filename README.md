# Kimitzu Client

![banner](./public/images/Logo/full-blue.png)

This repository contains the client to be used with Kimitzu-Go and Kimitzu-Services.

# Building

Run `npm run build` to build the client. This will output the build files on `./build`.

# Running

> You need to run `kimitzu-go` and `kimitzu-services` prior to this.

Run `npm run serve`. 
This will host the client on port `3000`.

# Advanced

For users who want to host their Kimitzu instance remotely, see  [Installation Instructions](INSTALL.md)

# Tests

Unit tests: `npm run react-test`.
UI tests: `npm run cypress:open`.