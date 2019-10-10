# Djali Client

![banner](https://i.imgur.com/uWoageJ.png)

This repository contains the client to be used with Djali-Go and Djali-Services.

# Building

Run `npm run build` to build the client. This will output the build files on `./build`.

# Running

> You need to run `djali-go` and `djali-services` prior to this.

Run `npm run serve`. 
This will host the client on port `3000`.

# Advanced

For users who want to host their Djali instance remotely, see  [Advanced Installation Instructions](InstallationInstructions.md)

# Tests

Unit tests: `npm run react-test`.
UI tests: `npm run cypress:open`.