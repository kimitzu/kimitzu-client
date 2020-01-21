import { RefresherEventDetail } from '@ionic/core'
import { IonContent, IonPage, IonRefresher, IonRefresherContent } from '@ionic/react'
import React, { useEffect, useState } from 'react'

import { ConvoList } from '../../components/ChatBox'
import { MobileHeader } from '../../components/Header'
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

  useEffect(() => {
    setChat(chatData)
    setIsRetrieving(false)
  }, [])

  useEffect(() => {
    setChat(chatData)
  }, chatData.conversations)

  const retrieveChat = async () => {
    try {
      const updatedChat = await Chat.retrieve()
      updatedChat.sortConversations()
      if (isRefreshing) {
        setChat(updatedChat)
      }
      // TODO: add handler if profile cannot retrieve
      await updatedChat.syncMessages()
      setChat(new Chat(updatedChat))
      await updatedChat.syncProfiles()
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
    window.location.hash = `/messages/${peerID}`
  }

  const handleRefresh = (e: CustomEvent<RefresherEventDetail>) => {
    setIsRefreshing(true)
    retrieveChat()
    e.detail.complete()
  }

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
      </IonContent>
    </IonPage>
  )
}

export default MobileChat
