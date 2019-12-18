import Axios from 'axios'

import config from '../config'
import { localeInstance } from '../i18n'
import Conversation, { Message } from '../interfaces/Conversation'
import Profile from './Profile'

class Chat {
  public static async retrieve(): Promise<Chat> {
    const convoRequest = await Axios.get(`${config.openBazaarHost}/ob/chatconversations`)
    let conversations: Conversation[] = convoRequest.data
    conversations = conversations.map(convo => {
      convo.image = `${config.host}/images/user.svg`
      convo.messages = []
      convo.name = convo.peerId
      return convo
    })
    return new Chat({ conversations })
  }

  public static async retrieveMessages(peerID: string, limit: number = 20): Promise<Message[]> {
    const messages = await Axios.get(
      `${config.openBazaarHost}/ob/chatmessages/${peerID}?limit=${limit}&offsetId=&subject=`
    )
    return messages.data
  }

  public static async sendMessage(peerID: string, message: string, subject: string = '') {
    const res = await Axios.post(`${config.openBazaarHost}/ob/chat`, {
      subject,
      message,
      peerId: peerID,
    })
    return res.data
  }

  public conversations: Conversation[] = []
  public selectedConvoIndex: number = 0

  constructor(props?) {
    if (props) {
      Object.assign(this, props)
    }
  }

  public async syncProfilesAndMessages() {
    this.conversations = await Promise.all(
      this.conversations.map(async (convo: Conversation, index: number) => {
        const { peerId } = convo
        const profile = await Profile.retrieve(peerId, false, true)
        if (profile) {
          convo.name = profile.name
          convo.image = `${config.openBazaarHost}/ob/images/${profile.avatarHashes.small}`
        }
        const messages: Message[] = await Chat.retrieveMessages(peerId)
        if (messages) {
          convo.messages = messages.reverse()
        }
        return convo
      })
    )
  }

  public async newConversation(profile: Profile) {
    const index: number = this.getConvoIndexByPeerID(profile.peerID)
    let selectedConvo: Conversation
    if (index !== -1) {
      selectedConvo = this.conversations.splice(index, 1)[0]
    } else {
      selectedConvo = {
        lastMessage: localeInstance.get.localizations.chatComponent.emptyConvoText,
        outgoing: false,
        peerId: profile.peerID,
        timestamp: new Date().toString(),
        unread: 0,
        image: profile.getAvatarSrc('small'),
        name: profile.name,
        messages: [],
      }
    }
    this.conversations.unshift(selectedConvo)
    this.selectedConvoIndex = 0
  }

  public getConvoIndexByPeerID(peerID: string): number {
    return this.conversations.findIndex(convo => convo.peerId === peerID)
  }

  public updateSelectedConvo(peerID: string) {
    const index = this.getConvoIndexByPeerID(peerID)
    if (index > -1 && index < this.conversations.length) {
      this.selectedConvoIndex = index
    }
  }

  public async sendMessageToSelectedRecipient(message: string) {
    const { selectedConversation, selectedConvoIndex } = this
    const { peerId } = selectedConversation
    this.conversations.splice(selectedConvoIndex, 1)
    const messageData: Message = {
      message,
      messageId: '',
      outgoing: true,
      peerId: selectedConversation.peerId,
      read: true,
      subject: '',
      timestamp: new Date().toString(),
      isSending: true,
    }
    selectedConversation.messages.push(messageData)
    selectedConversation.lastMessage = message
    selectedConversation.timestamp = new Date().toString()
    this.conversations.unshift(selectedConversation)
    this.selectedConvoIndex = 0
    const response = await Chat.sendMessage(peerId, message)
    if (response) {
      const index = this.getConvoIndexByPeerID(peerId) // get the index again because the conversations ordering might have changed
      const { messages } = this.conversations[index]
      this.conversations[index].messages[messages.length - 1].isSending = false
    }
    return response
  }

  public async handleWebsocketMessage(messageData: Message) {
    const { peerId, message, timestamp } = messageData
    const index = this.getConvoIndexByPeerID(peerId)
    let conversation: Conversation
    if (index !== -1) {
      let name = peerId
      let image = `${config.host}/images/user.svg`
      const profile = await Profile.retrieve(peerId)
      if (profile) {
        name = profile.name
        image = profile.getAvatarSrc('small')
      }
      // TODO: Check messageData if it contains the right info, if yes no need to create new message object
      const newMessage: Message = {
        message,
        messageId: '',
        outgoing: false,
        peerId: '',
        read: false,
        subject: '',
        timestamp,
      }
      conversation = {
        lastMessage: message,
        outgoing: false,
        peerId,
        timestamp,
        unread: 0,
        image,
        name,
        messages: [newMessage],
      }
    } else {
      conversation = this.conversations.splice(index, 1)[0]
      conversation.messages.push(messageData)
      conversation.lastMessage = message
      conversation.timestamp = timestamp
    }
    this.selectedConvoIndex = 0
    this.conversations.unshift(conversation)
  }

  get selectedConversation() {
    const { conversations, selectedConvoIndex } = this
    return conversations[selectedConvoIndex]
  }
}

export default Chat
