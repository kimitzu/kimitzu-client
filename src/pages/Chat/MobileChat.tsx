import { RefresherEventDetail } from '@ionic/core'
import { IonContent, IonModal, IonPage, IonRefresher, IonRefresherContent } from '@ionic/react'
import React, { useEffect, useState } from 'react'

import { ConversationsBox, ConvoList } from '../../components/ChatBox'
import { ChatHeader } from '../../components/Header'
import Chat from '../../models/Chat'

const MobileChat = () => {
  const [chat, setChat] = useState<Chat>(new Chat())
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [showConvo, setShowConvo] = useState<boolean>(false)

  useEffect(() => {
    retrieveChat()
  }, [])

  const retrieveChat = async () => {
    try {
      const chatData = await Chat.retrieve()
      chatData.sortConversations()
      if (isRefreshing) {
        setChat(chatData)
      }
      await chatData.syncProfilesAndMessages()
      setChat(new Chat(chatData))
      setIsRefreshing(false)
    } catch (error) {
      // TODO: add handler
      console.log(error)
    }
  }

  const handleRecipientChange = (peerID: string) => {
    setChat(prevState => {
      prevState.updateSelectedConvo(peerID)
      return new Chat(prevState)
    })
    setShowConvo(true)
    setTimeout(() => {
      const objDiv = document.getElementById('messages-display-cont')
      if (objDiv) {
        objDiv.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }

  const handleBackBtn = () => {
    setShowConvo(false)
  }

  const handleSendMsg = async () => {
    if (/^\s*$/.test(message)) {
      return
    }
    setIsDisabled(true)
    setMessage('')
    const res = await chat.sendMessageToSelectedRecipient(message)
    setChat(new Chat(chat))
    if (res) {
      setIsDisabled(false)
    }
  }

  const handleMessageChange = msg => {
    setMessage(msg)
  }

  const handleRefresh = (e: CustomEvent<RefresherEventDetail>) => {
    setIsRefreshing(true)
    retrieveChat()
    e.detail.complete()
  }

  const { selectedConversation } = chat
  return (
    <IonPage>
      <IonContent id="chat-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <ConvoList
          conversations={chat.conversations}
          selectedIndex={chat.selectedConvoIndex}
          onRecipientChange={handleRecipientChange}
        />
        <IonModal isOpen={showConvo}>
          {chat.conversations.length > 0 ? (
            <>
              <ChatHeader
                title={selectedConversation.name}
                peerID={selectedConversation.peerId}
                handleBackBtn={handleBackBtn}
              />
              <ConversationsBox
                conversation={selectedConversation}
                chatBoxOnChange={handleMessageChange}
                chatValue={message}
                disabled={isDisabled}
                sendMsg={handleSendMsg}
              />
            </>
          ) : null}
        </IonModal>
      </IonContent>
    </IonPage>
  )
}

export default MobileChat