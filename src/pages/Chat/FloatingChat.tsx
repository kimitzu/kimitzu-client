import axios from 'axios'
import React from 'react'

import { ChatBox } from '../../components/ChatBox'
import config from '../../config'
import { localeInstance } from '../../i18n'

interface FloatingChatState {
  conversations: any[]
  chatMsg: string
  disabled: boolean
  indexPeerID: any[]
  scrollBottom: boolean
  currID: string
  currIndex: number
  isOpen: boolean
}

interface Messages {
  message: string
  messageId: string
  outgoing: boolean
  peerId: string
  read: boolean
  subject: string
  timestamp: string
  sent: boolean
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
      currIndex: 0,
      isOpen: false,
    }
    this.handleChatMsg = this.handleChatMsg.bind(this)
    this.handleRecipientChange = this.handleRecipientChange.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)
    this.sendMsg = this.sendMsg.bind(this)
    this.handleWebsocket = this.handleWebsocket.bind(this)
    this.directMessage = this.directMessage.bind(this)
    this.preventInput = false
    this.toggleChatBox = this.toggleChatBox.bind(this)
    this.scrollBottom = this.scrollBottom.bind(this)
    this.handleWebsocket = this.handleWebsocket.bind(this)
  }

  public async componentDidMount() {
    window.socket.addEventListener('message', this.handleWebsocket)

    const conv = await axios.get(`${config.openBazaarHost}/ob/chatconversations`)
    const c = conv.data

    if (c.length !== 0) {
      c.map(async (cc, i) => {
        const indexPeerIDTemp = this.state.indexPeerID
        indexPeerIDTemp.push(cc.peerId)
        this.setState({ indexPeerID: indexPeerIDTemp })
        const prof = await axios.get(`${config.djaliHost}/djali/peer/get?id=${cc.peerId}`)
        c[i].image = `${process.env.PUBLIC_URL}/images/user.svg`
        c[i].name = cc.peerId
        if (prof && prof.data.profile) {
          if (prof.data.profile.avatarHashes) {
            c[
              i
            ].image = `${config.openBazaarHost}/ob/images/${prof.data.profile.avatarHashes.small}`
          } else {
            c[i].image = `${config.host}/images/user.svg`
          }
          c[i].name = prof.data.profile.name
        }
        const message = await axios.get(
          `${config.openBazaarHost}/ob/chatmessages/${cc.peerId}?limit=20&offsetId=&subject=`
        )
        if (message) {
          c[i].messages = message.data.reverse()
        } else {
          c[i].messages = []
        }
        c[i].messages.sent = true
      })
    }

    this.setState({ conversations: c })

    const directMsgFunction = (event: CustomEvent) => {
      const data = {
        peerId: event.detail.peerID,
        name: event.detail.name,
        avatar: event.detail.avatarHashes.small
          ? `${config.openBazaarHost}/ob/images/${event.detail.avatarHashes.small}`
          : `${config.host}/images/user.svg`,
      }
      this.directMessage(data)
      this.setState({ isOpen: true })
      setTimeout(() => {
        const convoli = document.getElementById(`convo${this.state.currIndex}`)
        if (convoli) {
          convoli.click()
        }
      })
    }
    window.addEventListener('dm', directMsgFunction as EventListener)
  }

  public toggleChatBox() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  public async directMessage(data) {
    const convos = this.state.conversations
    const result = await convos.some(c => c.peerId === data.peerId)
    if (result) {
      const index = this.state.indexPeerID.indexOf(data.peerId)
      this.setState({ currIndex: index })
    } else {
      const convDM = {
        lastMessage: localeInstance.get.localizations.chatComponent.emptyConvoText,
        outgoing: false,
        peerId: data.peerId,
        timestamp: new Date(),
        unread: 0,
        image: data.avatar || `${config.host}/images/user.svg`,
        name: data.name,
        messages: [],
      }
      convos.unshift(convDM)
      this.setState({ conversations: convos })
    }
  }

  public async handleWebsocket(data) {
    const socketMessageObject = JSON.parse(data.data)
    if (socketMessageObject.message && !socketMessageObject.message.subject) {
      const newMsg = socketMessageObject.message
      const index = this.state.indexPeerID.indexOf(socketMessageObject.message.peerId)
      const indexPeerIdTemp = this.state.indexPeerID
      const msg = socketMessageObject.message.message
      const realTimeConv = this.state.conversations
      if (index < 0) {
        indexPeerIdTemp.push(socketMessageObject.message.peerId)
        this.setState({ indexPeerID: indexPeerIdTemp })
        const prof = await axios.get(
          `${config.djaliHost}/djali/peer/get?id=${socketMessageObject.message.peerId}`
        )
        let name = ''
        let image = ''
        if (prof && prof.data.profile) {
          if (prof.data.profile.avatarHashes) {
            image = `${config.openBazaarHost}/ob/images/${prof.data.profile.avatarHashes.small}`
          } else {
            image = `${config.host}/images/user.svg`
          }
          name = prof.data.profile.name
        }
        const msgObj = {
          message: msg,
          messageId: '',
          outgoing: false,
          peerId: '',
          read: false,
          subject: '',
          timestamp: new Date(),
          sent: false,
        }
        const convNew = {
          lastMessage: msg,
          outgoing: false,
          peerId: socketMessageObject.message.peerId,
          timestamp: new Date(),
          unread: 0,
          image,
          name,
          messages: [msgObj],
        }
        convNew.lastMessage = msg
        convNew.timestamp = new Date(socketMessageObject.message.timestamp)
        realTimeConv.unshift(convNew)
      } else {
        if (!realTimeConv[index]) {
          realTimeConv[index] = []
        }

        realTimeConv[index].messages.push(newMsg)
        realTimeConv[index].lastMessage = msg
        realTimeConv[index].timestamp = new Date(socketMessageObject.message.timestamp)
      }
      this.setState({
        conversations: realTimeConv,
        scrollBottom: true,
        indexPeerID: indexPeerIdTemp,
      })
      this.scrollBottom()
    }
  }

  public scrollBottom() {
    const objDiv = document.getElementById('messages-display-cont')
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight
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
    setTimeout(() => {
      this.scrollBottom()
    })
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
      sent: false,
    }

    let index = this.state.indexPeerID.indexOf(this.state.currID)

    const conv = this.state.conversations
    if (index < 0) {
      index = 0
    }
    const lastPushIndex = conv[index].messages.length
    if (this.state.chatMsg !== '') {
      conv[index].messages.push(msg)
      conv[index].lastMessage = chatmsgTemp
      conv[index].timestamp = new Date()

      this.setState({ disabled: true, chatMsg: '' })
      this.setState({ conversations: conv, scrollBottom: true })

      const res = await axios.post(`${config.openBazaarHost}/ob/chat`, {
        subject: '',
        message: chatmsgTemp,
        peerId: this.state.currID,
      })
      if (res) {
        conv[index].messages[lastPushIndex].sent = true
        this.setState({ chatMsg: '', disabled: false, conversations: conv })
        const el = document.getElementById('chat-input')
        if (el) {
          el.focus()
        }
      }
    }
    this.scrollBottom()
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
        isOpen={this.state.isOpen}
        toggleChatBox={this.toggleChatBox}
      />
    )
  }
}

export default FloatingChat
