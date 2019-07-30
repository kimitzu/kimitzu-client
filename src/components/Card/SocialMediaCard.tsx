import React from 'react'

import SocialMedia from '../../constants/SocialMedia.json'
import { Contact } from '../../interfaces/Profile'
import './SocialMediaCard.css'

interface SocialMediaCardProps {
  contact: Contact
  title?: string
}

const SocialMediaCard = ({ contact, title }: SocialMediaCardProps) => {
  const socialMedia = contact.social

  return (
    <div className="uk-margin-top">
      <div className="uk-card uk-card-default uk-card-body">
        <h3 id="title-social-media" className="uk-card-title">
          {title ? title : 'Social Media'}
        </h3>

        {contact.email ? (
          <div id="social-media">
            <div id="account-icon">
              <span uk-icon="mail" />
            </div>
            <div id="account-name">
              <p className="uk-text-capitalize">Email</p>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          </div>
        ) : null}

        {socialMedia.map(social => {
          const SocialType = SocialMedia.find(e => {
            return e.value === social.type
          })

          return (
            <div id="social-media" key={social.type}>
              <div id="account-icon">
                <span uk-icon={`icon: ${SocialType ? SocialType.icon : 'social'}`} />
              </div>
              <div id="account-name">
                <p className="uk-text-capitalize">{social.type}</p>
                <a href={SocialType!.link.replace('{uid}', social.username)}>{social.username}</a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SocialMediaCard
