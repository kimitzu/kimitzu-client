import classNames from 'classnames'
import React, { useState } from 'react'

import { localeInstance } from '../../i18n'
import ChatModel from '../../models/Chat'
import ConversationsBox from './ConversationsBox'
import ConvoList from './ConvoList'

import './Chat.css'

export interface ChatProps {
  chat: ChatModel
  scrollBottom: boolean
  chatBoxOnchange: (value: string) => void
  onRecipientChange: (value: string) => void
  onKeyPress: (value: string) => void
  toggleChatBox: () => void
  chatValue: string
  disabled: boolean
  sendMsg: () => void
  isOpen: boolean
}

const Chat = ({
  chat,
  scrollBottom,
  chatBoxOnchange,
  onRecipientChange,
  onKeyPress,
  chatValue,
  disabled,
  sendMsg,
  isOpen,
  toggleChatBox,
}: ChatProps) => {
  return (
    <div id="chatbox-main-container" className={classNames({ increaseWidth: isOpen })}>
      <div id="left-side">
        <div id="header-left" onClick={toggleChatBox}>
          <img
            src={`${process.env.PUBLIC_URL}/images/support.svg`}
            alt="Support icon"
            height="25"
            width="25"
          />
          <p id="msg-title-left">{localeInstance.get.localizations.chatComponent.messagesText}</p>
        </div>
        <div id="convos-left">
          <ConvoList
            conversations={chat.conversations}
            onRecipientChange={onRecipientChange}
            selectedIndex={chat.selectedConvoIndex}
          />
        </div>
      </div>
      <div id="right-side" className={classNames({ rightSideHide: !isOpen })}>
        {chat.conversations.length > 0 ? (
          <>
            <div id="header-right" onClick={toggleChatBox}>
              <p id="title-right">
                {chat.selectedConversation.name || chat.selectedConversation.peerId}
              </p>
              <span id="close-right" uk-icon="icon: close; ratio: 1" />
            </div>
            <div id="messages-display-main">
              <ConversationsBox
                conversation={chat.selectedConversation}
                chatBoxOnChange={chatBoxOnchange}
                onKeyPress={onKeyPress}
                chatValue={chatValue}
                disabled={disabled}
                sendMsg={sendMsg}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Chat
