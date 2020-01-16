import { IonApp, IonContent, IonPage, isPlatform } from '@ionic/react'
import Axios from 'axios'
import isElectron from 'is-electron'
import React, { Fragment } from 'react'
import waitOn from 'wait-on'

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
import Chat from './models/Chat'
import { moderatorManagerInstance } from './models/ModeratorManager'
import { Search, searchInstance } from './models/Search'

import '@ionic/react/css/core.css'
import './config/main.css'

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
  waitText: string
  chat: Chat
}

class App extends React.Component<{}, State> {
  private intervalTimer: number = 0
  private timeoutTimer: number = 0

  constructor(props) {
    super(props)
    const profile = new Profile()
    const settings = new Settings()
    const chat = new Chat()
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
      waitText: 'Please Wait...',
      chat,
    }
    this.connect = this.connect.bind(this)
    this.activateTimer = this.activateTimer.bind(this)
    this.renderContent = this.renderContent.bind(this)
    this.updateBreadCrumb = this.updateBreadCrumb.bind(this)
    this.updateProfile = this.updateProfile.bind(this)
    this.handleChatEvent = this.handleChatEvent.bind(this)
    this.handleWebSocket = this.handleWebSocket.bind(this)
  }

  public updateProfile(profile: Profile) {
    this.setState({
      profile,
    })
  }

  public async componentDidMount() {
    if (isElectron()) {
      const options = {
        resources: [`${config.openBazaarHost}/ob/config`, `${config.kimitzuHost}/kimitzu/peers`],
      }
      this.setState({
        waitText: 'Connecting to Kimitzu, this might take a while...',
      })
      await waitOn(options)
      this.setState({
        waitText: 'Please Wait...',
      })
    }

    await this.connect()
    setTimeout(() => {
      this.setState({ height: window.innerHeight })
    }, 1000)
    this.updateBreadCrumb()
    window.onhashchange = () => {
      this.updateBreadCrumb()
    }
  }

  public componentWillUnmount() {
    if (this.state.isAuthenticated) {
      window.removeEventListener('dm', this.handleChatEvent as EventListener)
      window.socket.removeEventListener('message', this.handleWebSocket)
    }
  }

  public updateBreadCrumb() {
    const breadCrumb = this.state.breadCrumb.breadCrumbRecordHistory()
    this.setState({ breadCrumb })
  }

  public render() {
    return (
      <IonApp>
        <Fragment>
          {isElectron() ? (
            <>
              <div data-uk-sticky>
                <DefaultTitleBar />
              </div>
              <div>{this.renderContent()}</div>
            </>
          ) : (
            this.renderContent()
          )}
        </Fragment>
      </IonApp>
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
      chat,
    } = this.state
    if (!isReady) {
      return <FullPageSpinner message={this.state.waitText} />
    } else if (isReady && !isServerConnected) {
      return (
        <div className="full-vh uk-flex uk-flex-middle uk-flex-center uk-flex-column">
          <img
            className="uk-margin-large"
            width="150"
            height="150"
            src={`${config.host}/images/Logo/full-blue.png`}
            alt="Kimitzu Logo"
          />
          <h4 className="uk-text-danger">We could not connect to your server.</h4>
          <h4 className="uk-text-danger">Please make sure that the Kimitzu Server is running. </h4>
          <p className="uk-margin-large-top">Retrying in {this.state.secondTimer}s...</p>
        </div>
      )
    } else if (showSignup) {
      return (
        <IonPage>
          <IonContent>
            <div>
              <UserRegistration />
            </div>
          </IonContent>
        </IonPage>
      )
    } else if (!isAuthenticated) {
      return <Login />
    }

    return (
      <CurrentUserContext.Provider
        value={{
          settings,
          currentUser: profile,
          chat,
          updateCurrentUser: this.updateProfile,
        }}
      >
        <Routes chat={chat} history={this.state.breadCrumb.breadHistory} />
        {!(isPlatform('mobile') || isPlatform('mobileweb')) ? (
          <FloatingChat chatData={chat} />
        ) : null}
      </CurrentUserContext.Provider>
    )
  }

  private async connect() {
    this.setState({ isReady: false, isServerConnected: false })
    window.clearInterval(this.intervalTimer)
    let isAuthenticated = false
    try {
      const profile = await Profile.retrieve('', true)
      const chat = await Chat.retrieve()
      localeInstance.setLanguage(profile.preferences.language)
      const settings = await Settings.retrieve()
      const authRequest = await Axios.get(`${config.kimitzuHost}/authenticate`)
      moderatorManagerInstance.initialize(settings, profile.peerID)
      this.setState({
        profile,
        settings,
        chat,
        isReady: true,
        isServerConnected: true,
      })

      await chat.syncProfilesAndMessages()
      this.setState({ chat })

      if (isElectron()) {
        /**
         * Additional checks if the electron client is used as cookies
         * are handled differently.
         */
        const { session } = window.require('electron').remote
        const kimitzuCookie = await session.defaultSession.cookies.get({ url: config.kimitzuHost })
        const openbazaarCookie = await session.defaultSession.cookies.get({
          url: config.openBazaarHost,
        })

        isAuthenticated =
          (kimitzuCookie.length >= 1 && openbazaarCookie.length >= 1) ||
          !authRequest.data.authentication
      } else {
        isAuthenticated = document.cookie !== '' || !authRequest.data.authentication
      }
      if (isAuthenticated) {
        window.socket.addEventListener('message', this.handleWebSocket)
        window.addEventListener('dm', this.handleChatEvent as EventListener)
      }
      this.setState({
        isAuthenticated,
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

  private async handleWebSocket(data) {
    const socketMessageObject = JSON.parse(data.data)
    const { chat } = this.state
    if (socketMessageObject.message && !socketMessageObject.message.subject) {
      const messageData = socketMessageObject.message
      await chat.handleWebsocketMessage(messageData)
    }
  }

  private handleChatEvent(event: CustomEvent) {
    const { chat } = this.state
    chat.newConversation(event.detail)
    if (isPlatform('mobile')) {
      window.location.hash = `/messages/${event.detail.peerID}`
      window.location.reload()
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
