import React from 'react'

import isElectron from 'is-electron'
import SocialMedia from '../../constants/SocialMedia.json'
import { localeInstance } from '../../i18n'
import { Contact } from '../../interfaces/Listing.js'
import { Contact as ProfileContact } from '../../interfaces/Profile'
import './SocialMediaCard.css'

interface SocialMediaCardProps {
  contact: ProfileContact
  title?: string
  listingSpecificContact?: Contact
}

const SocialMediaCard = ({ contact, title, listingSpecificContact }: SocialMediaCardProps) => {
  const { localizations } = localeInstance.get
  const socialMedia = contact.social

  return (
    <div className="uk-margin-bottom">
      <div className="uk-card uk-card-default uk-card-body">
        <h3 id="title-social-media" className="uk-card-title">
          {title || localizations.profilePage.socialMediaHeader}
        </h3>

        {contact.email || listingSpecificContact!.email ? (
          <div id="social-media">
            <div id="account-icon">
              <span uk-icon="mail" />
            </div>
            <div id="account-name">
              <p className="uk-text-capitalize">{localizations.emailLabel}</p>
              <a
                href={`mailto:${
                  listingSpecificContact && listingSpecificContact.email
                    ? listingSpecificContact.email
                    : contact.email
                }`}
              >
                {listingSpecificContact && listingSpecificContact.email
                  ? listingSpecificContact.email
                  : contact.email}
              </a>
            </div>
          </div>
        ) : null}

        {listingSpecificContact && listingSpecificContact.phoneNumber ? (
          <div id="social-media">
            <div id="account-icon">
              <span uk-icon="receiver" />
            </div>
            <div id="account-name">
              <p className="uk-text-capitalize">{localizations.emailLabel}</p>
              <a href={`${listingSpecificContact.phoneNumber}`}>
                {listingSpecificContact.phoneNumber}
              </a>
            </div>
          </div>
        ) : null}

        {listingSpecificContact && listingSpecificContact.website ? (
          <div id="social-media">
            <div id="account-icon">
              <span uk-icon="world" />
            </div>
            <div id="account-name">
              <p className="uk-text-capitalize">{localizations.emailLabel}</p>
              <a href={`${listingSpecificContact.website}`}>{listingSpecificContact.website}</a>
            </div>
          </div>
        ) : null}

        {socialMedia &&
          socialMedia.map(social => {
            const SocialType = SocialMedia.find(e => {
              return e.value.toLowerCase() === social.type.toLowerCase()
            })

            let link

            if (SocialType) {
              link = SocialType!.link.replace('{uid}', social.username)
            } else {
              link = social.proof
            }

            return (
              <div id="social-media" key={social.type}>
                <div id="account-icon">
                  <span uk-icon={`icon: ${SocialType ? SocialType.icon : 'social'}`} />
                </div>
                <div id="account-name">
                  <p className="uk-text-capitalize">{social.type}</p>
                  {isElectron() ? (
                    <a
                      href="/#"
                      onClick={evt => {
                        evt.preventDefault()
                        window.openExternal(link)
                      }}
                    >
                      {social.username}
                    </a>
                  ) : (
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {social.username}
                    </a>
                  )}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default SocialMediaCard
