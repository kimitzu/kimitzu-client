import Axios from 'axios'
import {
  app,
  BrowserWindow,
  crashReporter,
  dialog,
  ipcMain,
  Menu,
  MenuItem,
  remote,
  shell,
} from 'electron'
import * as isDev from 'electron-is-dev'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import * as fs from 'fs'
import * as path from 'path'
import * as waitOn from 'wait-on'

import LocalServer from './LocalServer'

interface UserPreferences {
  enableCrashReporting: boolean
  autoInstallUpdate: boolean
  [key: string]: any
}

let mainWindow
let obServer
let kimitzuServices
let hasCheckedForUpdatesOnLaunch = false
let userPreferences: UserPreferences = { enableCrashReporting: false, autoInstallUpdate: false }
const userPrefPath = path.join((app || remote.app).getPath('userData'), 'user-preferences.json')
const crashReporterConfig = {
  productName: 'Kimitzu',
  companyName: 'Kimitzu Foundation',
  submitURL: 'http://breakpad.kimitzu.ch/crashreports',
  uploadToServer: userPreferences.enableCrashReporting,
}

const createUserPref = (data: UserPreferences) => {
  fs.writeFileSync(userPrefPath, JSON.stringify(data))
}

autoUpdater.logger = log
log.info(`Kimitzu Client v.${app.getVersion()} is starting...`)
autoUpdater.autoDownload = false
autoUpdater.allowDowngrade = true

if (!isDev && !process.argv.includes('--noexternal')) {
  const extension = process.platform === 'linux' || process.platform === 'darwin' ? '' : '.exe'

  const kimitzuGoServer = 'openbazaard' + extension

  const kimitzuServicesServer = 'services' + extension

  obServer = new LocalServer({
    name: 'Openbazaar',
    filePath: process.resourcesPath + '/lib',
    file: kimitzuGoServer,
  })
  kimitzuServices = new LocalServer({
    name: 'Kimitzu services',
    filePath: process.resourcesPath + '/lib',
    file: kimitzuServicesServer,
  })

  const launchServers = async () => {
    try {
      await Axios.get(`http://localhost:8100/ob/config`)
    } catch (e) {
      obServer.start(['start'])
    }

    const options = {
      resources: ['http://localhost:8100/ob/config'],
    }

    await waitOn(options)

    try {
      await Axios.get(`http://localhot:8109/kimitzu/peers`)
    } catch (e) {
      kimitzuServices.start()
    }
  }

  launchServers()
}

if (!fs.existsSync(userPrefPath)) {
  try {
    userPreferences = JSON.parse(fs.readFileSync(userPrefPath, 'utf8'))
  } catch (error) {
    log.error(`Error while reading user-preferences.json: ${error}`)
  }
}

autoUpdater.autoDownload = userPreferences.autoInstallUpdate

crashReporter.start(crashReporterConfig)

const askCrashReportingPermission = async (window: BrowserWindow) => {
  if (!fs.existsSync(userPrefPath)) {
    const reportingDialog = await dialog.showMessageBox(window, {
      type: 'info',
      title: 'Crash Reporting',
      message: 'Do you want to send the crash reports to the developers?',
      buttons: ['Yes', 'No', 'Learn More'],
    })
    if (reportingDialog.response === 0) {
      userPreferences.enableCrashReporting = true
      crashReporter.setUploadToServer(true)
    } else if (reportingDialog.response === 2) {
      askCrashReportingPermission(window) // open the dialog again since the dialog closes when selecting any of the buttons
      shell.openExternal('https://www.techopedia.com/definition/13529/windows-minidump')
      return
    }
    try {
      createUserPref(userPreferences)
    } catch (error) {
      log.error(`Error creating user-preferences.json: ${error}`)
    }
  }
}

const createWindow = async () => {
  const helpSubmenu = {
    label: 'Help',
    submenu: [
      {
        label: 'Website',
        click() {
          shell.openExternal('https://kimitzu.ch')
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

  ipcMain.on('requestCrashReporterConfig', () => {
    mainWindow.send('crashReporterConfig', crashReporterConfig)
  })

  ipcMain.on('requestUserPreferences', () => {
    mainWindow.send('userPreferences', userPreferences)
  })

  ipcMain.on('updateUserPreferences', (e, data: UserPreferences) => {
    userPreferences = data
    createUserPref(data)
  })

  await app.whenReady()
  mainWindow = new BrowserWindow({
    title: 'Kimitzu',
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

  askCrashReportingPermission(mainWindow)

  try {
    await autoUpdater.checkForUpdatesAndNotify()
  } catch (e) {
    console.log('Fetch update failed')
  }

  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', async () => {
  await createWindow()
  setTimeout(async () => {
    try {
      await autoUpdater.checkForUpdatesAndNotify()
    } catch (e) {
      console.warn('Update Error: ' + e.message)
    }
  }, 1000 * 60 * 60 * 24) // Check for updates every 24 hours if the app continues to run
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (obServer) {
      obServer.stop()
    }
    if (kimitzuServices) {
      kimitzuServices.stop()
    }

    app.quit()
  }
})

app.on('before-quit', () => {
  if (process.platform === 'darwin') {
    if (obServer) {
      obServer.stop()
    }
    if (kimitzuServices) {
      kimitzuServices.stop()
    }
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
  if (userPreferences.autoInstallUpdate) {
    return
  }
  const updateDialog = await dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'New Update',
    message: `Kimitzu client v${info.version} is now availabe, do you want to download it now?`,
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
    message: 'Updates were downloaded, the application will quit to install the update...',
  })
  if (updatesDialog) {
    setImmediate(() => autoUpdater.quitAndInstall())
  }
})
