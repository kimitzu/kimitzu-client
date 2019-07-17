import Axios from 'axios'
import config from '../config'
import Message from '../interfaces/Message'

class GroupMessage {
  public static async retrieve(topic: string) {
    const request = await Axios.get(
      `${config.openBazaarHost}/ob/chatmessages?limit&offsetId&subject=${topic}`
    )
    const messages = request.data.sort((a, b) => {
      const dateA = new Date(a.timestamp)
      const dateB = new Date(b.timestamp)

      if (dateA === dateB) {
        return 0
      }
      return dateA < dateB ? -1 : 1
    })
    const groupMessage = new GroupMessage({
      messages,
      subject: topic,
    })
    return groupMessage
  }

  public messages: Message[] = [
    {
      message: '',
      messageId: '',
      outgoing: true,
      peerId: '',
      read: false,
      subject: '',
      timestamp: '',
    },
  ]
  public peerIds: string[] = []
  public subject: string = ''

  constructor(props?) {
    Object.assign(this, props)
  }

  public async send(message: string) {
    const formattedMessage: Message = {
      subject: this.subject,
      message,
      peerIds: this.peerIds,
      read: false,
      outgoing: true,
      processedMessage: message,
      timestamp: new Date().toISOString(),
    }

    this.messages.push(formattedMessage)

    await Axios.post(`${config.openBazaarHost}/ob/groupchat`, formattedMessage)
  }
}

export default GroupMessage
