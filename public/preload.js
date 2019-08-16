window.remote = require('electron').remote;
window.openExternal = (url) => require('electron').shell.openExternal(url)