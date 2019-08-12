const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const isDev = require('electron-is-dev')

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'Djali',
    width: 1200,
    height: 680,
    minWidth: 1200,
    minHeight: 680,
    center: true,
    icon: path.join(__dirname, 'favicon.ico'),
    autoHideMenuBar: true,
    frame:false,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js'
    }
  })
  mainWindow.loadURL(
    isDev ?
    'http://localhost:3000' :
    `file://${path.join(__dirname, '../build/index.html')}`
  )
  mainWindow.on('closed', () => (mainWindow = null))
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})