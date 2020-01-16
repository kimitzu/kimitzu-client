import { IonPage } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { match as Match } from 'react-router-dom'

import { ConversationsBox } from '../../components/ChatBox'
import { ChatHeader } from '../../components/Header'
import { FullPageSpinner } from '../../components/Spinner'
import Chat from '../../models/Chat'

interface MatchParams {
  peerID: string
}

interface Props {
  chatData: Chat
  match: Match<MatchParams>
}

const MobileConversation = ({ chatData, match }: Props) => {
  const [isReady, setIsReady] = useState<boolean>(false)
  const [peerID, setPeerID] = useState<string>('')
  const [chat, setChat] = useState<Chat>(new Chat())
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  useEffect(() => {
    const targetPeer = match.params.peerID
    setPeerID(targetPeer)
    chatData.newConversation(targetPeer)
    setChat(chatData)
    setIsReady(true)
  }, [])
  useEffect(() => {
    setChat(chatData)
  }, chatData.conversations)

  const handleBackBtn = () => {
    window.history.back()
  }
  const handleMessageChange = msg => {
    chat.handleWriteMessage(msg)
    setChat(new Chat(chat))
  }
  const handleSendMsg = async () => {
    setIsDisabled(true)
    const res = await chat.sendMessageToSelectedRecipient()
    setChat(new Chat(chat))
    if (res) {
      setIsDisabled(false)
    }
  }
  const { selectedConversation, writtenMessage } = chat
  const title = selectedConversation ? selectedConversation.name : peerID
  return (
    <IonPage>
      <ChatHeader title={title} peerID={peerID} handleBackBtn={handleBackBtn} />
      {isReady ? (
        <ConversationsBox
          conversation={selectedConversation}
          chatBoxOnChange={handleMessageChange}
          chatValue={writtenMessage}
          disabled={isDisabled}
          sendMsg={handleSendMsg}
        />
      ) : (
        <FullPageSpinner />
      )}
    </IonPage>
  )
}

export default MobileConversation
