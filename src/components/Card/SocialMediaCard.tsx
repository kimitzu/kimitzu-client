import React from 'react'

import SocialMedia from '../../constants/SocialMedia.json'
import { SocialAccount } from '../../interfaces/Profile'
import './SocialMediaCard.css'

interface SocialMediaCardProps {
  socialMedia: SocialAccount[]
}

const SocialMediaCard = ({ socialMedia }: SocialMediaCardProps) => {
  return (
    <div className="uk-margin-top">
      <div className="uk-card uk-card-default uk-card-body">
        <h3 id="title-social-media" className="uk-card-title">
          Social Media
        </h3>

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
