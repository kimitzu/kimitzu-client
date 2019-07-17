export default interface Message {
  message: string
  outgoing: boolean
  read: boolean
  subject: string
  timestamp: string

  // For incoming messages
  messageId?: string
  peerId?: string

  // For outgoing messages
  peerIds?: string[]
  processedMessage?: string
}
