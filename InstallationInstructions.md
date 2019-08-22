# Building on MAC OSX

## Prerequisites:

Mac OS High Sierra (macOS >= 10.11.6)

[NodeJS, Current Version](https://nodejs.org/en/)


Yarn:
```
npm install -g yarn
```

RPM:
```
brew install rpm
```

## Building

(1) Clone the repository:
```
git clone https://github.com/djali-foundation/djali-client.git
```

(2) Install dependencies

During this proces, all required system dependencies determined by the packager will be downloaded automatically on demand on macOS 10.12+ (macOS Sierra).

```
cd djali-client
yarn install
npm run build:local:mac
```