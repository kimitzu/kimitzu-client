import isElectron from 'is-electron'
import React from 'react'

import Login from '../components/Card/Login'
import config from '../config'
import Profile from '../models/Profile'

import { localeInstance } from '../i18n'

class LoginPage extends React.Component {
  private locale = localeInstance.get.localizations

  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
  }

  public async handleLogin(username: string, password: string) {
    try {
      const credentialRequest = await Profile.login(username, password)
      const cookie = credentialRequest.data.success
      document.cookie = cookie

      if (isElectron()) {
        /**
         * Electron handles cookies differently than browsers.
         */
        const { session } = window.require('electron').remote

        const credentialParts = cookie.split('=')
        const today = new Date()
        today.setDate(today.getDate() + 1)

        const kimitzuCookie = {
          url: config.kimitzuHost,
          name: credentialParts[0],
          value: credentialParts[1],
          expirationDate: today.getTime() * 1000, // Expires in 1 day
        }
        const openbazaarCookie = {
          url: config.openBazaarHost,
          name: credentialParts[0],
          value: credentialParts[1],
          expirationDate: today.getTime() * 1000, // Expires in 1 day
        }
        await session.defaultSession.cookies.set(kimitzuCookie)
        await session.defaultSession.cookies.set(openbazaarCookie)

        const remote = window.remote
        const currentWindow = remote.getCurrentWindow()
        const { webContents } = currentWindow
        webContents.clearHistory()
      }
      window.location.hash = '/'
      window.location.reload()
    } catch (e) {
      console.error(e)
      window.UIkit.notification(e.response ? e.response.data.error : e.message, {
        status: 'danger',
      })
    }
  }

  public render() {
    return (
      <div className="uk-container-expand full-vh background-body uk-flex uk-flex-middle uk-flex-center">
        <div className="uk-card uk-card-default uk-width-1-3@s uk-width-1-4@l uk-width-auto uk-flex uk-flex-column uk-padding">
          <div className="uk-flex uk-flex-center">
            <img src={`${config.host}/images/Logo/full-blue.png`} alt="Kimitzu Logo" />
          </div>
          <div className="uk-margin-top">
            <Login onSubmit={this.handleLogin} submitLabel={this.locale.loginBtnText} />
          </div>
        </div>
      </div>
    )
  }
}

export default LoginPage
