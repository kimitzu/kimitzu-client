export interface Message {
  message: string
  messageId: string
  outgoing: boolean
  peerId: string
  read: boolean
  subject: string
  timestamp: string
  isSending?: boolean
}

interface Conversation {
  lastMessage: string
  outgoing: boolean
  peerId: string
  timestamp: string
  unread: number
  image: string
  name: string
  messages: Message[]
}

export default Conversation
