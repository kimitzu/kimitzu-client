import Axios from 'axios'
import config from '../config'
import Profile from './Profile'

interface ModeratorResponse {
  id: string
  peerId: string
}

class WebSocketResponses {
  public moderators: Profile[] = []

  public async initialize() {
    const moderatorWebsocketResponse = await Axios.get(
      `${config.openBazaarHost}/ob/moderators?async=true`
    )

    window.socket.addEventListener('message', async socketData => {
      const jsonSocketData = JSON.parse(socketData.data) as ModeratorResponse
      if (jsonSocketData.id && jsonSocketData.id === moderatorWebsocketResponse.data.id) {
        const moderatorProfile = await Profile.retrieve(jsonSocketData.peerId)
        const event = new CustomEvent('moderator-resolve', { detail: moderatorProfile })
        window.dispatchEvent(event)
        this.moderators.push(moderatorProfile)
      }
    })
  }
}

const webSocketResponsesInstance = new WebSocketResponses()
export { webSocketResponsesInstance, WebSocketResponses }
