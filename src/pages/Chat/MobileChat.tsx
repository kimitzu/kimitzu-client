import { RefresherEventDetail } from '@ionic/core'
import { IonContent, IonModal, IonPage, IonRefresher, IonRefresherContent } from '@ionic/react'
import React, { useEffect, useState } from 'react'

import { ConversationsBox, ConvoList } from '../../components/ChatBox'
import { ChatHeader, MobileHeader } from '../../components/Header'
import { CircleSpinner } from '../../components/Spinner'
import { localeInstance } from '../../i18n'
import Chat from '../../models/Chat'

interface Props {
  chatData: Chat
}

const MobileChat = ({ chatData }: Props) => {
  const [chat, setChat] = useState<Chat>(new Chat())
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [isRetrieving, setIsRetrieving] = useState<boolean>(true)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [showConvo, setShowConvo] = useState<boolean>(false)

  useEffect(() => {
    setChat(new Chat(chatData))
    setIsRetrieving(false)
  }, [])

  useEffect(() => {
    setChat(new Chat(chatData))
  }, [chatData])

  const retrieveChat = async () => {
    try {
      const updatedChat = await Chat.retrieve()
      updatedChat.sortConversations()
      if (isRefreshing) {
        setChat(updatedChat)
      }
      // TODO: add handler if profile cannot retrieve
      await updatedChat.syncProfilesAndMessages()
      setChat(new Chat(updatedChat))
    } catch (error) {
      // TODO: add handler
      console.log(error)
    }
    setIsRetrieving(false)
    setIsRefreshing(false)
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
    const res = await chat.sendMessageToSelectedRecipient()
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
      <MobileHeader title="MESSAGES" />
      <IonContent id="chat-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        {!isRetrieving ? (
          <ConvoList
            conversations={chat.conversations}
            selectedIndex={chat.selectedConvoIndex}
            onRecipientChange={handleRecipientChange}
          />
        ) : (
          <div className="uk-flex uk-flex-center uk-flex-middle uk-height-1-1">
            <CircleSpinner message={localeInstance.get.localizations.chatComponent.spinnerText} />
          </div>
        )}
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
