import { Server } from 'mock-socket'

class WebSocketMock {
  constructor(url) {
    this.url = url
    this.mockServer = new Server(url)
    this.sockets = []
    this.mockServer.on('connection', socket => {
      this.sockets.push(socket)
    })
  }

  sendMsg(msg) {
    this.sockets.forEach((socket) => {
      socket.send(msg)
    })
  }
}

export default WebSocketMock
