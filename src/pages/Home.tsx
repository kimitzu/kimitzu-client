import React, { Component } from 'react'

import { SettingsModal } from '../components/Modal'
import NavBar from '../components/NavBar/NavBar'

class Home extends Component {
  constructor(props: any) {
    super(props)
    this.handleSettings = this.handleSettings.bind(this)
  }

  public handleSettings() {
    window.UIkit.modal('#settings').show()
  }

  public render() {
    return (
      <div>
        <NavBar handleSettings={this.handleSettings} />
        <SettingsModal />
      </div>
    )
  }
}

export default Home
