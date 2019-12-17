import { spawn, SpawnOptions } from 'child_process'
import log from 'electron-log'
import * as path from 'path'

interface LocalServerOptions {
  filePath: string
  file: string
  name: string
}

interface LocalServerProps extends LocalServerOptions {
  isRunning: boolean
  isStopping: boolean
  subProcess: SpawnOptions
}

class LocalServer implements LocalServerProps {
  public file = ''
  public filePath = ''
  public name = ''
  public isRunning = false
  public isStopping = false
  public subProcess = null

  constructor(options: LocalServerOptions) {
    const { file, filePath, name } = options
    this.filePath = filePath
    this.file = file
    this.name = name
  }

  public start(args: string[] = []) {
    const { file, filePath, isRunning, isStopping, name } = this
    log.info(`${name} is starting`)

    if (isStopping) {
      this.subProcess.once('exit', () => {
        this.start(args)
      })
      log.info(`Will start after ${name} server shutdown is complete.`)
      return
    }

    if (isRunning) {
      log.error(`${name} is aleady running.`)
      throw new Error('Server is already running.')
    }

    this.subProcess = spawn(path.join(filePath, file), args)

    this.subProcess.stdout.on('data', data => {
      console.log(data.toString())
    })

    this.subProcess.on('error', error => {
      log.error(`${name} server error: ${error}`)
    })

    this.subProcess.on('exit', (code, signal) => {
      const logMsg = code
        ? `Server exited with code: ${code}.`
        : `Server exited at request of signal: ${signal}.`
      log.info(logMsg)
      this.isRunning = false
    })

    this.isRunning = true
    log.info(`${name} server is running.`)
  }

  public stop() {
    const { isRunning, subProcess, name } = this
    log.info(`Stopping ${name} server/`)
    if (!isRunning) {
      return
    }
    this.isStopping = true
    subProcess.once('exit', () => {
      this.isRunning = false
      this.isStopping = false
    })
    if (process.platform === 'linux' || process.platform === 'darwin') {
      subProcess.kill()
    } else {
      // TODO: post ob/shutdown if the server is openbazaar; child_process.kill() doesn't work on windows
      spawn('taskkill', ['/pid', subProcess.pid, '/f', '/t'])
    }
  }
}

export default LocalServer
