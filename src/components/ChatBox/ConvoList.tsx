import React from 'react'

import Conversation from '../../interfaces/Conversation'
import { ChatProps } from './Chat'

import './Chat.css'

interface Props {
  conversations: Conversation[]
  onRecipientChange: ChatProps['onRecipientChange']
  selectedIndex: number
}

const ConvoList = ({ conversations, onRecipientChange, selectedIndex }: Props) => (
  <ul id="convos-ul" className="uk-height-1-1">
    {conversations.length > 0 ? (
      conversations.map((data, i) => {
        const newTime = new Date(data.timestamp)
        const now = new Date()
        let timeStat
        if (newTime.getDate() === now.getDate()) {
          timeStat = newTime.toLocaleTimeString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit',
          })
        } else {
          timeStat = newTime.toLocaleDateString()
        }
        return (
          <li key={i}>
            <div
              id={`convo${i}`}
              className={
                i === selectedIndex ? 'convos-content-cont isActive' : 'convos-content-cont'
              }
              onClick={() => {
                onRecipientChange(data.peerId)
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
      })
    ) : (
      <div className="uk-text-center uk-height-1-1 uk-flex-center uk-flex uk-flex-middle">
        <h5>Your inbox is empty.</h5>
      </div>
    )}
  </ul>
)

export default ConvoList
