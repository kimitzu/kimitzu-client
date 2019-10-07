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

  sendMsg() {
    this.sockets.forEach((socket) => {
      socket.send(`{"notification":{
        "coinType":"TBTC",
        "fundingTotal":4805,
        "notificationId":"QmPjf7PKW6Bx58A7yWDsAuvpu6MrMKJWRAt19WPom7MzuP",
        "orderId":"QmfBMEAAhmvTzktS31QAwPKj89kiyhSDJeUZBx1vyHLkfd",
        "type":"payment"}
      }`)
    })
  }
}

export default WebSocketMock
