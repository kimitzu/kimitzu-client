import axios from 'axios'
import React from 'react'
import { ChatBox } from '../../components/ChatBox'
import config from '../../config'

interface FloatingChatState {
  conversations: any[]
  chatMsg: string
  disabled: boolean
  indexPeerID: any[]
  scrollBottom: boolean
  currID: string
}

class FloatingChat extends React.Component<{}, FloatingChatState> {
  private preventInput: boolean

  constructor(props) {
    super(props)
    this.state = {
      conversations: [],
      chatMsg: '',
      disabled: false,
      indexPeerID: [],
      scrollBottom: true,
      currID: '',
    }
    this.handleChatMsg = this.handleChatMsg.bind(this)
    this.handleRecipientChange = this.handleRecipientChange.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)
    this.sendMsg = this.sendMsg.bind(this)
    this.handleWebsocket = this.handleWebsocket.bind(this)
    this.preventInput = false
  }

  public async componentDidMount() {
    const conv = await axios.get(`${config.openBazaarHost}/ob/chatconversations`)
    const c = conv.data

    if (c.length !== 0) {
      c.map(async (cc, i) => {
        const indexPeerIDTemp = this.state.indexPeerID
        indexPeerIDTemp.push(cc.peerId)
        this.setState({ indexPeerID: indexPeerIDTemp })
        const prof = await axios.get(`${config.djaliHost}/djali/peer/get?id=${cc.peerId}`)
        if (prof && prof.data.profile) {
          if (prof.data.profile.avatarHashes) {
            c[i].image = `${config.openBazaarHost}/ob/images/${
              prof.data.profile.avatarHashes.small
            }`
          } else {
            c[i].image = '/images/user.png'
          }
          c[i].name = prof.data.profile.name
          const message = await axios.get(
            `${config.openBazaarHost}/ob/chatmessages/${cc.peerId}?limit=20&offsetId=&subject=`
          )
          if (message) {
            c[i].messages = message.data.reverse()
          } else {
            c[i].messages = []
          }
        }
      })
    }

    this.setState({ conversations: c })

    const socket = new WebSocket(config.websocketHost)
    socket.onmessage = this.handleWebsocket
  }

  public handleWebsocket(data) {
    const d = JSON.parse(data.data)
    if (d.message) {
      const newMsg = d.message
      const index = this.state.indexPeerID.indexOf(d.message.peerId)
      const msg = d.message.message
      const realTimeConv = this.state.conversations

      if (!realTimeConv[index]) {
        realTimeConv[index] = []
      }

      realTimeConv[index].messages.push(newMsg)
      realTimeConv[index].lastMessage = msg
      this.setState({ conversations: realTimeConv, scrollBottom: true })
    }
  }

  public handleChatMsg(value) {
    if (this.preventInput) {
      this.preventInput = false
      return
    }
    this.setState({ chatMsg: value })
  }

  public handleRecipientChange(value) {
    this.setState({ currID: value })
  }

  public async sendMsg() {
    const chatmsgTemp = this.state.chatMsg
    const msg = {
      message: this.state.chatMsg,
      messageId: '',
      outgoing: true,
      peerId: this.state.currID,
      read: true,
      subject: '',
      timestamp: new Date(),
    }

    const index = this.state.indexPeerID.indexOf(this.state.currID)

    const conv = this.state.conversations
    if (this.state.chatMsg !== '') {
      conv[index].messages.push(msg)
      conv[index].lastMessage = chatmsgTemp
    }
    this.setState({ disabled: true, chatMsg: '' })
    this.setState({ conversations: conv, scrollBottom: true })

    const res = await axios.post(`${config.openBazaarHost}/ob/chat`, {
      subject: '',
      message: chatmsgTemp,
      peerId: this.state.currID,
    })
    if (res) {
      this.setState({ chatMsg: '', disabled: false })
      const el = document.getElementById('chat-input')
      if (el) {
        el.focus()
      }
    }
  }

  public async onKeyPress(event) {
    const code = event.keyCode || event.which
    if (code === 13 && !event.shiftKey) {
      this.preventInput = true
      await this.sendMsg()
    }
  }

  public render() {
    return (
      <ChatBox
        convos={this.state.conversations}
        scrollBottom={this.state.scrollBottom}
        chatBoxOnchange={this.handleChatMsg}
        onRecipientChange={this.handleRecipientChange}
        onKeyPress={this.onKeyPress}
        chatValue={this.state.chatMsg}
        disabled={this.state.disabled}
        sendMsg={this.sendMsg}
      />
    )
  }
}

export default FloatingChat
