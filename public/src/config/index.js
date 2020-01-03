"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var local = {
    kimitzuHost: "http://" + (window.location.hostname || '127.0.0.1') + ":8109",
    kimitzuSocket: "ws://" + (window.location.hostname || '127.0.0.1') + ":8109/p2p/ratings/seek/%id%",
    host: process.env.PUBLIC_URL,
    openBazaarHost: "http://" + (window.location.hostname || '127.0.0.1') + ":8100",
    websocketHost: "ws://" + (window.location.hostname || '127.0.0.1') + ":8100/ws"
};
var remote = {
    kimitzuHost: 'https://kimitzu-api.kimitzu.ch',
    kimitzuSocket: "wss://kimitzu-api.kimitzu.ch/p2p/ratings/seek/%id%",
    host: 'https://test.kimitzu.ch',
    openBazaarHost: 'https://kimitzu-ob.kimitzu.ch',
    websocketHost: 'wss://kimitzu-ob.kimitzu.ch/ws'
};
function getConfig() {
    console.log('Mode: ' + process.env.NODE_ENV);
    console.log('Link: ' + process.env.REACT_APP_LINK);
    switch (process.env.REACT_APP_LINK) {
        case 'local': {
            return local;
        }
        case 'remote': {
            return remote;
        }
        default: {
            return local;
        }
    }
}
exports["default"] = __assign({}, getConfig());
