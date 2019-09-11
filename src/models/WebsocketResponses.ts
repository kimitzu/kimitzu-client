import Axios from 'axios'
import config from '../config'

interface ModeratorResponse {
  id: string
  peerId: string
}

class WebSocketResponses {
  public moderatorIDs: string[] = []

  public async initialize() {
    const moderatorWebsocketResponse = await Axios.get(
      `${config.openBazaarHost}/ob/moderators?async=true`
    )
    window.socket.onmessage = socketData => {
      const jsonSocketData = JSON.parse(socketData.data) as ModeratorResponse
      if (jsonSocketData.id && jsonSocketData.id === moderatorWebsocketResponse.data.id) {
        this.moderatorIDs.push(jsonSocketData.peerId)
      }
    }
  }
}

const webSocketResponsesInstance = new WebSocketResponses()
export { webSocketResponsesInstance, WebSocketResponses }
