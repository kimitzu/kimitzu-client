import { spawn, SpawnOptions } from 'child_process'
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
    const { file, filePath, isRunning } = this

    if (isRunning) {
      throw new Error('Server is already running.')
    }

    this.subProcess = spawn(path.join(filePath, file), args)

    this.subProcess.on('error', error => {
      console.log(error)
    })

    this.subProcess.on('exit', (code, signal) => {
      const logMsg = code
        ? `Server exited with code: ${code}`
        : `Server exited at request of signal: ${signal}`
      console.log(logMsg)
      this.isRunning = false
    })

    this.isRunning = true
  }

  public stop() {
    const { isRunning, subProcess } = this
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
