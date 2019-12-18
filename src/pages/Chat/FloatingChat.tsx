import axios from 'axios'
import React from 'react'

import { ChatBox } from '../../components/ChatBox'
import config from '../../config'
import { localeInstance } from '../../i18n'
import Chat from '../../models/Chat'

interface FloatingChatState {
  chatMsg: string
  disabled: boolean
  scrollBottom: boolean
  isOpen: boolean
  chat: Chat
}

class FloatingChat extends React.Component<{}, FloatingChatState> {
  private preventInput: boolean
  constructor(props) {
    super(props)
    this.state = {
      chatMsg: '',
      disabled: false,
      scrollBottom: true,
      isOpen: false,
      chat: new Chat(),
    }
    this.handleChatMsg = this.handleChatMsg.bind(this)
    this.handleRecipientChange = this.handleRecipientChange.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)
    this.sendMsg = this.sendMsg.bind(this)
    this.handleWebsocket = this.handleWebsocket.bind(this)
    this.preventInput = false
    this.toggleChatBox = this.toggleChatBox.bind(this)
    this.scrollBottom = this.scrollBottom.bind(this)
    this.handleChatEvent = this.handleChatEvent.bind(this)
  }

  public async componentDidMount() {
    window.socket.addEventListener('message', this.handleWebsocket)
    try {
      const chat = await Chat.retrieve()
      this.setState({ chat })
      await chat.syncProfilesAndMessages()
      this.setState({ chat })
    } catch (error) {
      // TODO: add handler
      console.log(error)
    }
    window.addEventListener('dm', this.handleChatEvent as EventListener)
  }

  public componentWillUnmount() {
    window.socket.removeEventListener('message', this.handleWebsocket)
    window.removeEventListener('dm', this.handleChatEvent as EventListener)
  }

  public handleChatEvent(event: CustomEvent) {
    const { chat } = this.state
    chat.newConversation(event.detail)
    this.setState({ isOpen: true })
    setTimeout(() => {
      const convoli = document.getElementById(`convo${chat.selectedConvoIndex}`)
      if (convoli) {
        convoli.click()
      }
    })
  }

  public toggleChatBox() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  public async handleWebsocket(data) {
    const socketMessageObject = JSON.parse(data.data)
    const { chat } = this.state
    if (socketMessageObject.message && !socketMessageObject.message.subject) {
      const messageData = socketMessageObject.message
      await chat.handleWebsocketMessage(messageData)
      this.setState({
        scrollBottom: true,
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
    const { chat } = this.state
    chat.updateSelectedConvo(value)
    this.setState({ chat })
    setTimeout(() => {
      this.scrollBottom()
    })
  }

  public async sendMsg() {
    const { chat, chatMsg } = this.state
    if (/^\s*$/.test(chatMsg)) {
      return
    }
    this.setState({ disabled: true, chatMsg: '' })
    const res = await chat.sendMessageToSelectedRecipient(chatMsg)
    this.setState({ chat, scrollBottom: true })
    if (res) {
      this.setState({ chatMsg: '', disabled: false })
      const el = document.getElementById('chat-input')
      if (el) {
        el.focus()
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
    const { chat, scrollBottom, chatMsg, disabled, isOpen } = this.state
    return (
      <ChatBox
        chat={chat}
        scrollBottom={scrollBottom}
        chatBoxOnchange={this.handleChatMsg}
        onRecipientChange={this.handleRecipientChange}
        onKeyPress={this.onKeyPress}
        chatValue={chatMsg}
        disabled={disabled}
        sendMsg={this.sendMsg}
        isOpen={isOpen}
        toggleChatBox={this.toggleChatBox}
      />
    )
  }
}

export default FloatingChat
