const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const isDev = require('electron-is-dev')
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
const serve = require('electron-serve');


var server
var services
// -- Services -- //
// Execute the server and service first before loading anything else.
if (!isDev && !process.argv.includes("--noexternal")) {
  if (process.platform.startsWith('win')) {
    var extob = path.join("external", "openbazaard.exe");
    var extserv = path.join("external", "services.exe");
    server = spawn(extob,  ['start', '--testnet']);
    services = spawn(extserv,  []);
  
  } else if (process.platform.startsWith('linux')) {
    const extob = path.join("external", "openbazaard");
    const extserv = path.join("external", "services");
    server = spawn(extob,  ['start', '--testnet']);
    services = spawn(extserv,  []);
  }
}


// -- Electron -- //
var loadURL;
if (!isDev) {
  loadURL = serve({directory: path.join(__dirname)});
}

let mainWindow
const createWindow = async () => {
  await app.whenReady();
  mainWindow = new BrowserWindow({
    title: 'Djali',
    width: 1200,
    height: 680,
    minWidth: 1200,
    minHeight: 680,
    center: true,
    icon: path.join(__dirname, 'favicon.ico'),
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      devTools: isDev,
      nodeIntegration: false,
      preload: __dirname + '/preload.js',
    },
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
  } else {
    mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  }
  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (!isDev) {
    try { services.kill() } catch {}
    try { server.kill() } catch {}
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
