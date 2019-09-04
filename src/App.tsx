import Axios from 'axios'
import isElectron from 'is-electron'
import React, { Fragment } from 'react'

import { FullPageSpinner } from './components/Spinner'
import { DefaultTitleBar } from './components/TitleBar'
import { Login, UserRegistration } from './pages'
import FloatingChat from './pages/Chat/FloatingChat'
import Routes from './Routes'

import Profile from './models/Profile'

import config from './config'

if (isElectron()) {
  // tslint:disable-next-line: no-var-requires
  require('./config/notification.css')
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
}

class App extends React.Component<{}, State> {
  private timer: number = 0

  constructor(props) {
    super(props)
    this.state = {
      height: 680,
      isReady: false,
      isServerConnected: false,
      showSignup: false,
      isAuthenticated: true,
    }
    this.connect = this.connect.bind(this)
    this.renderContent = this.renderContent.bind(this)
  }

  public async componentDidMount() {
    this.timer = window.setInterval(async () => {
      await this.connect()
    }, 5000)

    setTimeout(() => {
      this.setState({ height: window.innerHeight })
    }, 1000)
  }

  public render() {
    const { height, isReady, isServerConnected } = this.state
    if (!isReady) {
      return <FullPageSpinner message="Please wait..." />
    } else if (isReady && !isServerConnected) {
      return (
        <div className="full-vh uk-flex uk-flex-middle uk-flex-center uk-flex-column">
          <img
            className="uk-margin-large"
            width="150"
            height="150"
            src="./images/Logo/Blue/SVG/Djali-Blue-Unique.svg"
          />
          <h4 className="uk-text-danger">We could not connect to your server.</h4>
          <h4 className="uk-text-danger">Please make sure that the Djali Server is running. </h4>
          <a className="text-underline" onClick={this.connect}>
            Try again
          </a>
        </div>
      )
    }

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
    const { isAuthenticated, showSignup } = this.state
    if (showSignup) {
      return <UserRegistration />
    } else if (!isAuthenticated) {
      return <Login />
    }
    return (
      <>
        <Routes />
        <FloatingChat />
      </>
    )
  }

  private async connect() {
    this.setState({ isReady: false, isServerConnected: false })
    try {
      await Profile.retrieve()
      const authRequest = await Axios.get(`${config.djaliHost}/authenticate`)

      window.clearInterval(this.timer)

      this.setState({
        isReady: true,
        isServerConnected: true,
        isAuthenticated: document.cookie !== '' || !authRequest.data.authentication,
      })
    } catch (error) {
      if (error.response) {
        window.clearInterval(this.timer)
        this.setState({
          isServerConnected: true,
          showSignup: error.response.status === 404 || error.response.status === 500,
        })
      }
      this.setState({ isReady: true })
    }
  }
}

export default App
