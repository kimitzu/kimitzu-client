import Axios from 'axios'

import config from '../config'
import { localeInstance } from '../i18n'
import Conversation, { Message } from '../interfaces/Conversation'
import Profile from './Profile'

interface Draft {
  [key: string]: string
}

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
  public draft: Draft = {}

  constructor(props?) {
    if (props) {
      Object.assign(this, props)
    }
  }

  public async syncProfilesAndMessages() {
    this.conversations = await Promise.all(
      this.conversations.map(async (convo: Conversation, index: number) => {
        const { peerId } = convo
        const messages: Message[] = await Chat.retrieveMessages(peerId)
        convo.messages = messages ? messages.reverse() : []
        try {
          const profile = await Profile.retrieve(peerId, false, true)
          if (profile) {
            convo.name = profile.name
            convo.image = `${config.openBazaarHost}/ob/images/${profile.avatarHashes.small}`
          }
        } catch (error) {
          // Do nothing. Use default peerID as name and default user image
        }
        return convo
      })
    )
  }

  public sortConversations() {
    this.conversations = this.conversations.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
  }

  // accepts profile or peerID
  public async newConversation(target: Profile | string) {
    let peerID: string
    let image: string
    let name: string
    if (typeof target === 'string') {
      peerID = target
      image = `${process.env.PUBLIC_URL}/images/user.svg`
      name = target
    } else {
      peerID = target.peerID
      name = target.name
      image = target.getAvatarSrc('small')
    }
    const index: number = this.getConvoIndexByPeerID(peerID)
    let selectedConvo: Conversation
    if (index !== -1) {
      selectedConvo = this.conversations.splice(index, 1)[0]
    } else {
      selectedConvo = {
        lastMessage: localeInstance.get.localizations.chatComponent.emptyConvoText,
        outgoing: false,
        peerId: peerID,
        timestamp: new Date().toString(),
        unread: 0,
        image,
        name,
        messages: [],
      }
    }
    this.conversations.unshift(selectedConvo)
    this.selectedConvoIndex = 0
    if (typeof target === 'string') {
      try {
        const profile = await Profile.retrieve(target)
        /**
         * Get convo index again because indexes may have change
         * after retrieving the profile
         */
        const convoIndex = this.getConvoIndexByPeerID(target)
        this.conversations[convoIndex].name = profile.name
        this.conversations[convoIndex].image = profile.getAvatarSrc('small')
      } catch (error) {
        // Do nothing.
      }
    }
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

  public async sendMessageToSelectedRecipient() {
    const { selectedConversation, selectedConvoIndex } = this
    const { peerId } = selectedConversation
    const message = this.draft[peerId]
    if (!message || /^\s*$/.test(message)) {
      return
    }
    this.draft[peerId] = ''
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
      /**
       * Get the index again before updating because the conversations
       * ordering might have changed.
       */
      const index = this.getConvoIndexByPeerID(peerId)
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
      /**
       * TODO: Check messageData if it contains the right info.
       * If yes no need to create new message object
       */
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

  public handleWriteMessage(message: string) {
    this.draft[this.selectedConversation.peerId] = message
  }

  get writtenMessage(): string {
    const { selectedConversation, draft } = this
    if (!selectedConversation) {
      return ''
    }
    return draft[selectedConversation.peerId] || ''
  }

  get selectedConversation(): Conversation {
    const { conversations, selectedConvoIndex } = this
    return conversations[selectedConvoIndex]
  }
}

export default Chat
