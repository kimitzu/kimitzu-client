import Axios from 'axios'
import isElectron from 'is-electron'
import React, { Fragment } from 'react'

import { FullPageSpinner } from './components/Spinner'
import { DefaultTitleBar } from './components/TitleBar'
import { Login, UserRegistration } from './pages'
import FloatingChat from './pages/Chat/FloatingChat'
import Routes from './Routes'

import Profile from './models/Profile'
import Settings from './models/Settings'

import config from './config'
import CurrentUserContext from './contexts/CurrentUserContext'
import { localeInstance } from './i18n'
import { BreadCrumb, breadCrumbInstance } from './models/BreadCrumb'
import { moderatorManagerInstance } from './models/ModeratorManager'
import { Search, searchInstance } from './models/Search'

if (isElectron()) {
  // tslint:disable-next-line: no-var-requires
  require('./config/notification.css')

  const electron = window.require('electron')
  const { ipcRenderer, crashReporter } = electron

  window.addEventListener(
    'contextmenu',
    e => {
      e.preventDefault()
      ipcRenderer.send('contextmenu')
    },
    false
  )

  ipcRenderer.send('requestCrashReporterConfig')

  ipcRenderer.once('crashReporterConfig', (e, crashReporterConfig) => {
    crashReporter.start(crashReporterConfig)
  })

  // ipcRenderer.on('server-shutdown', async () => {
  //   try {
  //     await Axios.post(`${config.openBazaarHost}/ob/shutdown`)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // })
}

declare global {
  interface Window {
    require: any
    remote: any
  }
}

interface State {
  height: number
  isReady: boolean
  isServerConnected: boolean
  showSignup: boolean
  isAuthenticated: boolean
  secondTimer: number
  profile: Profile
  [x: string]: any
  search: Search
  breadCrumb: BreadCrumb
  settings: Settings
}

class App extends React.Component<{}, State> {
  private intervalTimer: number = 0
  private timeoutTimer: number = 0

  constructor(props) {
    super(props)
    const profile = new Profile()
    const settings = new Settings()
    this.state = {
      height: 680,
      isReady: false,
      isServerConnected: false,
      showSignup: false,
      isAuthenticated: true,
      secondTimer: 5,
      profile,
      settings,
      search: searchInstance,
      breadCrumb: breadCrumbInstance,
    }
    this.connect = this.connect.bind(this)
    this.activateTimer = this.activateTimer.bind(this)
    this.renderContent = this.renderContent.bind(this)
    this.updateBreadCrumb = this.updateBreadCrumb.bind(this)
    this.updateProfile = this.updateProfile.bind(this)
  }

  public updateProfile(profile: Profile) {
    this.setState({
      profile,
    })
  }

  public async componentDidMount() {
    await this.connect()
    setTimeout(() => {
      this.setState({ height: window.innerHeight })
    }, 1000)
    this.updateBreadCrumb()
    window.onhashchange = () => {
      this.updateBreadCrumb()
    }
  }

  public updateBreadCrumb() {
    const breadCrumb = this.state.breadCrumb.breadCrumbRecordHistory()
    this.setState({ breadCrumb })
  }

  public render() {
    const { height } = this.state
    return (
      <Fragment>
        {isElectron() ? (
          <>
            <DefaultTitleBar />
            <div style={{ overflowY: 'auto', height: `${height - 46}px` }}>
              {this.renderContent()}
            </div>
          </>
        ) : (
          this.renderContent()
        )}
      </Fragment>
    )
  }

  private renderContent() {
    const {
      isAuthenticated,
      showSignup,
      isReady,
      isServerConnected,
      settings,
      profile,
    } = this.state
    if (!isReady) {
      return <FullPageSpinner message="Please wait..." />
    } else if (isReady && !isServerConnected) {
      return (
        <div className="full-vh uk-flex uk-flex-middle uk-flex-center uk-flex-column">
          <img
            className="uk-margin-large"
            width="150"
            height="150"
            src="./images/Logo/Blue/SVG/Kimitzu-Blue-Unique.svg"
          />
          <h4 className="uk-text-danger">We could not connect to your server.</h4>
          <h4 className="uk-text-danger">Please make sure that the Kimitzu Server is running. </h4>
          <p className="uk-margin-large-top">Retrying in {this.state.secondTimer}s...</p>
        </div>
      )
    } else if (showSignup) {
      return <UserRegistration />
    } else if (!isAuthenticated) {
      return <Login />
    }

    return (
      <CurrentUserContext.Provider
        value={{
          settings,
          currentUser: profile,
          updateCurrentUser: this.updateProfile,
        }}
      >
        <Routes history={this.state.breadCrumb.breadHistory} />
        <FloatingChat />
      </CurrentUserContext.Provider>
    )
  }

  private async connect() {
    this.setState({ isReady: false, isServerConnected: false })
    window.clearInterval(this.intervalTimer)

    try {
      const profile = await Profile.retrieve('', true)
      localeInstance.setLanguage(profile.preferences.language)
      const settings = await Settings.retrieve()
      const authRequest = await Axios.get(`${config.kimitzuHost}/authenticate`)
      moderatorManagerInstance.initialize(settings, profile.peerID)
      this.setState({
        profile,
        settings,
        isReady: true,
        isServerConnected: true,
        isAuthenticated: document.cookie !== '' || !authRequest.data.authentication,
      })
      this.setState({
        profile,
      })
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          this.setState({ isServerConnected: false, isReady: true })
          this.activateTimer()
          return
        }
        /**
         * Connection to server is successful but profile is not found.
         * Possibly a new Kimitzu instance, so show registration page.
         */
        window.clearInterval(this.intervalTimer)
        this.setState({
          isServerConnected: true,
          showSignup: error.response.status === 404,
        })
      } else {
        this.activateTimer()
      }
      this.setState({ isReady: true })
    }
  }

  private activateTimer() {
    this.intervalTimer = window.setInterval(() => {
      let timer = this.state.secondTimer
      if (timer <= 1) {
        timer = 5
      } else {
        timer -= 1
      }
      this.setState({
        secondTimer: timer,
      })
    }, 1000)

    this.timeoutTimer = window.setTimeout(async () => {
      await this.connect()
    }, 5000)
  }
}

export default App
