import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import config from './config'
import './config/main.css'
import { webSocketResponsesInstance } from './models/WebsocketResponses'
import * as serviceWorker from './serviceWorker'

declare global {
  interface Window {
    socket: WebSocket
    openExternal: (url) => void
    require: any
  }
}

const socket = new WebSocket(`${config.websocketHost}`)
window.socket = socket
webSocketResponsesInstance.initialize()

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
