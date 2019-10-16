import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem, shell } from 'electron'
import * as isDev from 'electron-is-dev'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'

import LocalServer from './LocalServer'

let obServer
let djaliServices
let hasCheckedForUpdatesOnLaunch = false

autoUpdater.logger = log
log.info(`Djali Client v.${app.getVersion()} is starting...`)
autoUpdater.autoDownload = false

if (!isDev && !process.argv.includes('--noexternal')) {
  const fileName =
    process.platform === 'linux' || process.platform === 'darwin'
      ? 'openbazaard'
      : 'openbazaard.exe'
  obServer = new LocalServer({
    name: 'Openbazaar',
    filePath: 'external',
    file: fileName,
  })
  djaliServices = new LocalServer({
    name: 'Djali services',
    filePath: 'external',
    file: fileName,
  })
  obServer.start(['start', '--testnet'])
  djaliServices.start()
}

let mainWindow

const createWindow = async () => {
  const helpSubmenu = {
    label: 'Help',
    submenu: [
      {
        label: 'Website',
        click() {
          shell.openExternal('https://djali.org')
        },
      },
      {
        label: 'Check for Updates',
        async click() {
          autoUpdater.checkForUpdates()
        },
      },
    ],
  }

  const menuTemplate = [
    new MenuItem({ role: 'editMenu' }),
    new MenuItem({ role: 'viewMenu' }),
    new MenuItem({ role: 'windowMenu' }),
    helpSubmenu,
  ]

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  ipcMain.on('contextmenu', () => {
    menu.popup()
  })

  await app.whenReady()
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
      devTools: true,
      nodeIntegration: true,
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

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify()
  createWindow()
})

app.on('window-all-closed', () => {
  if (obServer) {
    obServer.stop()
  }
  if (djaliServices) {
    djaliServices.stop()
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

autoUpdater.on('error', error => {
  dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString())
})

autoUpdater.on('update-available', async info => {
  const updateDialog = await dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'New Update',
    message: `Djali client v${info.version} is now availabe, do you want to download it now?`,
    buttons: ['Yes', 'No'],
  })
  if (updateDialog.response === 0) {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      message: 'Downloading update... We will notify you once it is ready.',
    })
    autoUpdater.downloadUpdate()
  }
})

autoUpdater.on('update-not-available', () => {
  // Don't notify the user if there is no update available upon launching the app
  if (!hasCheckedForUpdatesOnLaunch) {
    hasCheckedForUpdatesOnLaunch = true
    return
  }
  dialog.showMessageBox({
    title: 'No Updates',
    message: 'Current version is up-to-date.',
  })
})

autoUpdater.on('download-progress', progressObj => {
  let downloadLog = `Download speed: ${progressObj.bytesPerSecond}`
  downloadLog = `${downloadLog} - Downloaded ${progressObj.percent} %`
  downloadLog = `${downloadLog} (${progressObj.transferred}/${progressObj.total}) ${downloadLog}`
  log.info(downloadLog)
})

autoUpdater.on('update-downloaded', async () => {
  const updatesDialog = await dialog.showMessageBox(mainWindow, {
    title: 'Install Updates',
    message: 'Updates downloaded, application will be quit for update...',
  })
  if (updatesDialog) {
    setImmediate(() => autoUpdater.quitAndInstall())
  }
})
