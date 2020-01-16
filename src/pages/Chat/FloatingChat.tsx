import React, { useEffect, useState } from 'react'

import { ChatBox } from '../../components/ChatBox'
import Chat from '../../models/Chat'

interface Props {
  chatData: Chat
}

const FloatingChat = ({ chatData }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(false)
  const [scrollToBottom, setScrollToBottom] = useState<boolean>(true)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [chat, setChat] = useState(new Chat())
  const [preventInput, setPreventInput] = useState<boolean>(false)

  const handleChatEvent = () => {
    setIsOpen(true)
    setTimeout(() => {
      const convoli = document.getElementById(`convo${chat.selectedConvoIndex}`)
      if (convoli) {
        convoli.click()
      }
    })
  }

  const toggleChatBox = () => {
    setIsOpen(!isOpen)
  }

  const handleScrollToBottom = () => {
    const objDiv = document.getElementById('messages-display-cont')
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight
    }
  }

  const handleChatMsg = value => {
    if (preventInput) {
      setPreventInput(false)
      return
    }
    chat.handleWriteMessage(value)
    setChat(new Chat(chat))
  }

  const handleRecipientChange = value => {
    chat.updateSelectedConvo(value)
    setChat(new Chat(chat))
    setTimeout(() => {
      handleScrollToBottom()
    })
  }

  const sendMsg = async () => {
    setDisabled(true)
    const res = await chat.sendMessageToSelectedRecipient()
    setChat(new Chat(chat))
    setScrollToBottom(true)
    if (res) {
      setDisabled(false)
      const el = document.getElementById('chat-input')
      if (el) {
        el.focus()
      }
    }
    handleScrollToBottom()
  }

  const onKeyPress = async event => {
    const code = event.keyCode || event.which
    if (code === 13 && !event.shiftKey) {
      setPreventInput(true)
      await sendMsg()
    }
  }
  useEffect(() => {
    setChat(chatData)
    window.addEventListener('dm', handleChatEvent as EventListener)
    return () => {
      window.removeEventListener('dm', handleChatEvent as EventListener)
    }
  }, [])

  useEffect(() => {
    setChat(chatData)
  }, [chatData])

  return (
    <ChatBox
      chat={chat}
      scrollBottom={scrollToBottom}
      chatBoxOnchange={handleChatMsg}
      onRecipientChange={handleRecipientChange}
      onKeyPress={onKeyPress}
      chatValue={chat.writtenMessage}
      disabled={disabled}
      sendMsg={sendMsg}
      isOpen={isOpen}
      toggleChatBox={toggleChatBox}
    />
  )
}

export default FloatingChat
