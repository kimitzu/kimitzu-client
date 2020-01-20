import { IonContent, IonFooter, IonToolbar } from '@ionic/react'
import React, { useEffect, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { localeInstance } from '../../i18n'
import Conversation from '../../interfaces/Conversation'
import { useDidUpdate } from '../../utils/react-hooks'
import { ChatProps } from './Chat'
import './Chat.css'

interface Props {
  conversation: Conversation
  chatBoxOnChange: ChatProps['chatBoxOnchange']
  onKeyPress?: ChatProps['onKeyPress']
  chatValue: ChatProps['chatValue']
  disabled: ChatProps['disabled']
  sendMsg: ChatProps['sendMsg']
}

const ConversationsBox = ({
  conversation,
  chatBoxOnChange,
  onKeyPress,
  chatValue,
  disabled,
  sendMsg,
}: Props) => {
  const messagesEnd = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollToBottom()
  }, [conversation.messages.length])
  const scrollToBottom = () => {
    if (messagesEnd && messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }
  useDidUpdate(scrollToBottom, [conversation])
  return (
    <>
      <IonContent scrollEvents>
        <div
          style={{ minHeight: '100%' }}
          className="uk-flex uk-flex-bottom uk-flex-right uk-flex-column"
        >
          {conversation.messages.map((data, i) => {
            if (data.outgoing) {
              return (
                <div className="text-msg-cont-right" key={`m${i}`}>
                  <div className="text-msg-right">{data.message}</div>
                  {data.isSending ? (
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
                    <img className="avatar-recipient" src={conversation.image} alt="Small Avatar" />
                  </div>
                  <div className="text-msg-left">{data.message}</div>
                </div>
              )
            }
          })}
        </div>
        <div id="messages-end" ref={messagesEnd} />
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <div id="messages-chat-cont">
            <div id="message-input-cont">
              <TextareaAutosize
                id="chat-input"
                maxRows={6}
                className="message-input"
                placeholder={localeInstance.get.localizations.chatComponent.messagePlaceholder}
                useCacheForDOMMeasurements
                onChange={e => chatBoxOnChange(e.target.value)}
                onKeyPress={onKeyPress ? e => onKeyPress(e) : console.log('')}
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
        </IonToolbar>
      </IonFooter>
    </>
  )
}

export default ConversationsBox
