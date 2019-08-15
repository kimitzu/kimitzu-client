import isElectron from 'is-electron'
import React, { Fragment } from 'react'

import { Login } from './pages'
import FloatingChat from './pages/Chat/FloatingChat'
import TitleBar from './pages/TitleBar'
import Routes from './Routes'

declare global {
  interface Window {
    require: any
    remote: any
  }
}

interface State {
  height: number
  isAuthenticated: boolean
}

class App extends React.Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = { height: 680, isAuthenticated: false }
  }

  public async componentDidMount() {
    setInterval(() => {
      this.setState({ height: window.innerHeight })
    }, 1000)

    this.setState({
      isAuthenticated: document.cookie !== '',
    })
  }

  public render() {
    if (!this.state.isAuthenticated) {
      return <Login />
    }

    return isElectron() ? (
      <Fragment>
        <TitleBar />
        <div style={{ overflowY: 'auto', height: `${this.state.height - 46}px` }}>
          <Routes />
          <FloatingChat />
        </div>
      </Fragment>
    ) : (
      <Fragment>
        <Routes />
        <FloatingChat />
      </Fragment>
    )
  }
}

export default App
