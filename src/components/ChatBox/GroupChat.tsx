import React, { useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import config from '../../config'
import GroupMessage from '../../models/GroupMessage'
import Profile from '../../models/Profile'
import decodeHtml from '../../utils/Unescape'
import './Chat.css'

interface Props {
  groupMessage: GroupMessage
}

const GroupChat = ({ groupMessage }: Props) => {
  const [message, messageHandler] = useState('')
  const [preventInput, preventInputHandler] = useState(false)
  const [isSending, sendingHandler] = useState(false)
  const [imageCache, setImageCache] = useState({})
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const profileRequests = groupMessage.peerIds.map(peer => Profile.retrieve(peer))
    ;(async () => {
      const imgIndex = {}
      const profiles = await Promise.all(profileRequests)
      profiles.forEach(p => {
        imgIndex[p.peerID] = p.avatarHashes.small
      })
      setImageCache({ ...imgIndex })
      if (chatRef) {
        chatRef.current!.scrollIntoView()
      }
    })()
  }, [])

  const send = async () => {
    preventInputHandler(true)
    sendingHandler(true)
    await groupMessage.send(message)
    sendingHandler(false)
    messageHandler('')
    chatRef.current!.scrollIntoView()
  }

  return (
    <div className="uk-flex uk-width-1-1">
      <div id="full-size">
        <div id="messages-display-main">
          <div id="messages-display-cont">
            {groupMessage.messages.map(messageItem => {
              return (
                <div
                  key={messageItem.messageId}
                  className={`uk-flex uk-flex-row uk-flex-middle ${
                    !messageItem.outgoing ? 'text-msg-cont-left' : 'text-msg-cont-right'
                  }`}
                >
                  {!messageItem.outgoing ? (
                    <div className="uk-margin-small-right">
                      <img
                        src={
                          imageCache[messageItem.peerId!]
                            ? `${config.kimitzuHost}/kimitzu/media?id=${
                                imageCache[messageItem.peerId!]
                              }`
                            : `${config.host}/images/user.png`
                        }
                        className="avatar-cont-recepient"
                      />
                    </div>
                  ) : null}
                  <div
                    className={!messageItem.outgoing ? 'text-msg-left' : 'text-msg-right'}
                    uk-tooltip={`title:${messageItem.outgoing ? 'You' : 'Vendor'} (${new Date(
                      messageItem.timestamp
                    ).toLocaleString()});
                    pos:${!messageItem.outgoing ? 'top' : 'top-left'};
                    delay:300`}
                  >
                    {decodeHtml(messageItem.message)}
                  </div>
                </div>
              )
            })}
            <div ref={chatRef} />
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
                    src={`${process.env.PUBLIC_URL}/images/send.svg`}
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
