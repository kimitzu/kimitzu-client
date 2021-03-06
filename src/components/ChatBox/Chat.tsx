import classNames from 'classnames'
import React, { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { localeInstance } from '../../i18n'
import './Chat.css'

interface Props {
  convos: Conversations[]
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

interface Messages {
  message: string
  messageId: string
  outgoing: boolean
  peerId: string
  read: boolean
  subject: string
  timestamp: string
  sent: boolean
}

interface Conversations {
  lastMessage: string
  outgoing: boolean
  peerId: string
  timestamp: string
  unread: number
  image: string
  name: string
  messages: Messages[]
}

const Chat = ({
  convos,
  scrollBottom,
  chatBoxOnchange,
  onRecipientChange,
  onKeyPress,
  chatValue,
  disabled,
  sendMsg,
  isOpen,
  toggleChatBox,
}: Props) => {
  const [isActive, setisActive] = useState(-1)
  const [messages, setMessages] = useState<Messages[]>([])
  const [title, setTitle] = useState('')
  const [avatarSmall, setAvatarSmall] = useState('')

  function openChat(index, data, name) {
    setisActive(index)
    setMessages(data)
    setTitle(name)
  }

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
          <ul id="convos-ul">
            {convos.map((data, i) => {
              const convoTime = new Date(data.timestamp)
              const now = new Date()
              let timeStat
              if (now.getTime() - convoTime.getTime() <= 86400000) {
                // Equal to today
                timeStat = convoTime.toLocaleTimeString(navigator.language, {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              } else {
                timeStat = convoTime.toLocaleDateString()
              }
              return (
                <li key={i}>
                  <div
                    id={`convo${i}`}
                    className={
                      i === isActive ? 'convos-content-cont isActive' : 'convos-content-cont'
                    }
                    onClick={() => {
                      openChat(i, data.messages, data.name)
                      onRecipientChange(data.peerId)
                      setAvatarSmall(data.image)
                    }}
                  >
                    <div className="convos-image-cont">
                      <img
                        className="image-convo"
                        src={data.image}
                        alt="Smiley face"
                        height="65%"
                        width="65%"
                      />
                    </div>
                    <div className="convos-message-cont">
                      <div className="convos-message-header">
                        <div className="message-title">{data.name}</div>
                        <div className="message-time"> {timeStat} </div>
                      </div>
                      <div className="convos-message-teaser">
                        <div className="message">{data.lastMessage}</div>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div id="right-side" className={classNames({ rightSideHide: !isOpen })}>
        <div id="header-right" onClick={toggleChatBox}>
          <p id="title-right">{title}</p>
          <span id="close-right" uk-icon="icon: close; ratio: 1" />
        </div>
        <div id="messages-display-main">
          <div id="messages-display-cont">
            {messages &&
              messages.map((data, i) => {
                if (data.outgoing) {
                  return (
                    <div className="text-msg-cont-right" key={`m${i}`}>
                      <div className="text-msg-right">{data.message}</div>
                      {!data.sent ? (
                        <div className="avatar-cont-recepient">
                          <span data-uk-spinner="ratio: 0.5" />
                        </div>
                      ) : null}
                    </div>
                  )
                } else {
                  return (
                    <div className="text-msg-cont-left" key={`m${i}`}>
                      <div className="avatar-cont-recepient">
                        <img className="avatar-recipient" src={avatarSmall} alt="Small Avatar" />
                      </div>
                      <div className="text-msg-left">{data.message}</div>
                    </div>
                  )
                }
              })}
          </div>
          <div id="messages-chat-cont">
            <div id="message-input-cont">
              <TextareaAutosize
                id="chat-input"
                maxRows={6}
                className="message-input"
                placeholder={localeInstance.get.localizations.chatComponent.messagePlaceholder}
                useCacheForDOMMeasurements
                onChange={e => chatBoxOnchange(e.target.value)}
                onKeyPress={e => onKeyPress(e)}
                value={chatValue}
                disabled={disabled}
              />
            </div>
            <div id="message-button-cont">
              <div id="message-button-cont-two" onClick={sendMsg}>
                <div id="send-text-cont">
                  <img
                    id="img-send"
                    src={`${process.env.PUBLIC_URL}/images/send.svg`}
                    alt="Smiley face"
                    width="27"
                    height="27"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
