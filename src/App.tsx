import React, { Fragment } from 'react'

import FloatingChat from './pages/Chat/FloatingChat'
import Routes from './Routes'

class App extends React.Component {
  public render() {
    return (
      <Fragment>
        <Routes />
        <FloatingChat />
      </Fragment>
    )
  }
}

export default App
