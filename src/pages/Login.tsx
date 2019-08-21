import isElectron from 'is-electron'
import React from 'react'
import Login from '../components/Card/Login'
import Profile from '../models/Profile'

class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
  }

  public async handleLogin(username: string, password: string) {
    try {
      await Profile.login(username, password)
      if (isElectron()) {
        const remote = window.remote
        const currentWindow = remote.getCurrentWindow()
        const { webContents } = currentWindow
        webContents.clearHistory()
      }
      window.location.hash = '/'
      window.location.reload()
    } catch (e) {
      window.UIkit.notification(e.response.data.error, { status: 'danger' })
    }
  }

  public render() {
    return (
      <div className="uk-container-expand full-vh background-body uk-flex uk-flex-middle uk-flex-center">
        <div className="uk-card uk-card-default uk-width-1-3 uk-flex uk-flex-column uk-padding">
          <div className="uk-flex uk-flex-center">
            <img src="./images/Logo/Blue/SVG/Djali-Blue-Unique.svg" />
          </div>
          <Login onSubmit={this.handleLogin} submitLabel={'LOGIN'} />
        </div>
      </div>
    )
  }
}

export default LoginPage
