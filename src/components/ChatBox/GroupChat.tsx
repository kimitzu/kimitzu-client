import React, { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import GroupMessage from '../../models/GroupMessage'
import './Chat.css'

interface Props {
  groupMessage: GroupMessage
}

const GroupChat = ({ groupMessage }: Props) => {
  const [message, messageHandler] = useState('')
  const [preventInput, preventInputHandler] = useState(false)
  const [isSending, sendingHandler] = useState(false)

  const send = async () => {
    preventInputHandler(true)
    sendingHandler(true)
    await groupMessage.send(message)
    sendingHandler(false)
    messageHandler('')
  }

  return (
    <div className="uk-flex uk-width-1-1">
      <div id="full-size">
        <div id="messages-display-main">
          <div
            id="messages-display-cont"
            ref={ref => {
              if (ref) {
                ref.scrollTop = ref.scrollHeight
              }
            }}
          >
            {groupMessage.messages.map(messageItem => {
              return (
                <div
                  key={messageItem.messageId}
                  className={!messageItem.outgoing ? 'text-msg-cont-right' : 'text-msg-cont-left'}
                >
                  <div
                    className={!messageItem.outgoing ? 'text-msg-right' : 'text-msg-left'}
                    uk-tooltip={`title:${messageItem.outgoing ? 'You' : 'Vendor'} (${new Date(
                      messageItem.timestamp
                    ).toLocaleString()});
                    pos:${!messageItem.outgoing ? 'top' : 'top-left'};
                    delay:300`}
                  >
                    {messageItem.message}
                  </div>
                </div>
              )
            })}
          </div>
          <form id="messages-chat-cont">
            <div id="message-input-cont">
              <TextareaAutosize
                maxRows={6}
                className="message-input"
                placeholder="Type a message..."
                useCacheForDOMMeasurements
                value={message}
                onChange={evt => {
                  if (preventInput) {
                    preventInputHandler(false)
                    return
                  }
                  messageHandler(evt.target.value)
                }}
                onKeyDown={async evt => {
                  if (evt.keyCode === 13 && !evt.shiftKey) {
                    await send()
                  }
                }}
                disabled={isSending}
              />
            </div>
            <div id="message-button-cont">
              <div id="message-button-cont-two">
                <div
                  id="send-text-cont"
                  onClick={async () => {
                    await send()
                  }}
                >
                  <img
                    id="img-send"
                    src="/images/send.svg"
                    alt="Smiley face"
                    width="27"
                    height="27"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GroupChat
