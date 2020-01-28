# Kimitzu android

This project is using [Ionic Capacitor](https://ionicframework.com/) to run android. All the requirements required to run android can be found [here](https://capacitor.ionicframework.com/docs/getting-started/dependencies/).

The library for Openbazaar Server and Kimitzu Services are generated through [kimitzu-go/mobile](https://capacitor.ionicframework.com/docs/getting-started/dependencies/) and the generated `.aar` and `.jar` files should be stored in [android/app/libs](app/libs).

## Running

> You need to change `isTestnet` if necessary in the [MainActivity.java](app/src/main/java/com/kimitzu/dev/MainActivity.java).

You need two terminals to run android. Please make sure that your computer and phone are connected to the same network.

```
yarn react-start
ionic capacitor run android --livereload-url=http://<your_ip_address>:3000
```

The `Android Studio` will open and then select `Run`.

## Building

The script below will build the React App and copy the build files to the Android assets.

```
yarn prebuild:android:testnet
```

or

```
yarn prebuild:android:mainnet
```

After that, you can now generate an `apk` file though `Android Studio`.
