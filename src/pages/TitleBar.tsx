import React from 'react'
import { CustomTitleBar } from '../components/CustomTitleBar'

const remote = window.remote

class FloatingChat extends React.Component<{}> {
  constructor(props) {
    super(props)
    this.minimize = this.minimize.bind(this)
    this.maximize = this.maximize.bind(this)
    this.close = this.close.bind(this)
  }

  public minimize() {
    const window = remote.getCurrentWindow()
    window.minimize()
  }

  public maximize() {
    const window = remote.getCurrentWindow()
    if (!window.isMaximized()) {
      window.maximize()
    } else {
      window.unmaximize()
    }
  }

  public close() {
    const window = remote.getCurrentWindow()
    window.close()
  }

  public render() {
    return <CustomTitleBar minimize={this.minimize} maximize={this.maximize} close={this.close} />
  }
}

export default FloatingChat
