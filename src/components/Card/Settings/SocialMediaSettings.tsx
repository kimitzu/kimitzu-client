import React, { useState } from 'react'
import SocialMedia from '../../../constants/SocialMedia.json'
import { SocialAccount } from '../../../interfaces/Profile'
import Profile from '../../../models/Profile'

interface SocialMediaSettingsProps {
  profile: Profile
}

const SocialMediaSettings = ({ profile }: SocialMediaSettingsProps) => {
  const selectors: SocialAccount[] = profile.contactInfo.social || []

  const [socialSelectors, setSocialSelectors] = useState(selectors)
  const [mouseOverIndex, setMouseOverIndex] = useState(-1)

  const changeHandler = (index, field, value) => {
    if (index || index === 0) {
      const targetElement = socialSelectors[index]
      targetElement[field] = value
    } else {
      socialSelectors.push({
        type: value,
        username: '',
        proof: '',
      })
    }
    setSocialSelectors([...socialSelectors])
    profile.contactInfo.social = socialSelectors
  }

  const deleteHandler = index => {
    socialSelectors.splice(index, 1)
    setSocialSelectors([...socialSelectors])
    profile.contactInfo.social = socialSelectors
  }

  return (
    <div className="uk-flex uk-flex-column uk-margin-top">
      {socialSelectors.map((selector, index) => {
        return renderFormSelector(
          selector,
          index,
          changeHandler,
          mouseOverIndex,
          setMouseOverIndex,
          deleteHandler
        )
      })}
      {renderFormSelector(null, null, changeHandler, mouseOverIndex, setMouseOverIndex)}
    </div>
  )
}

const renderFormSelector = (
  socialInfo: SocialAccount | null,
  index,
  changeHandler,
  mouseOverIndex?,
  setMouseOverIndex?,
  deleteHandler?
) => {
  const SocialType = socialInfo
    ? SocialMedia.find(e => {
        return e.value === socialInfo!.type
      })
    : {
        icon: 'link',
      }

  return (
    <div
      key={index}
      className="uk-flex uk-flex-row uk-flex-middle uk-margin-bottom"
      onMouseOver={() => {
        if (index !== null) {
          setMouseOverIndex(index)
        }
      }}
    >
      <div className="uk-margin-right">
        <span data-uk-icon={`icon: ${SocialType!.icon}`} />
      </div>
      <div>
        <div className="uk-grid-small" data-uk-grid>
          <div className="uk-flex uk-flex-row uk-flex-middle">
            <div className="uk-width-1-4">
              <select
                className="uk-select"
                value={socialInfo ? socialInfo.type : ''}
                onChange={evt => {
                  changeHandler(index, 'type', evt.target.value)
                }}
              >
                {SocialMedia.map(socialMedia => {
                  return (
                    <option key={socialMedia.value} value={socialMedia.value}>
                      {socialMedia.label}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="uk-width-1-4 uk-margin-left">
              <input
                className="uk-input"
                type="text"
                placeholder="Username"
                value={socialInfo ? socialInfo.username : ''}
                disabled={!socialInfo}
                onChange={evt => {
                  changeHandler(index, 'username', evt.target.value)
                }}
              />
            </div>
            <div className="uk-width-1-2 uk-margin-left uk-inline">
              <input
                className="uk-input"
                type="text"
                placeholder="Proof"
                value={socialInfo ? socialInfo.proof : ''}
                disabled={!socialInfo}
                onChange={evt => {
                  changeHandler(index, 'proof', evt.target.value)
                }}
              />
              <a
                className="uk-icon-link uk-form-icon uk-form-icon-flip"
                data-uk-icon="icon: question"
                data-uk-tooltip="Link of a proof that you own that account (e.g. link of a post for facebook and link of a commit in github)."
              />
            </div>
          </div>
        </div>
      </div>
      <div className="uk-margin-left uk-width-1-10">
        {socialInfo && mouseOverIndex === index ? (
          <a
            onClick={() => {
              deleteHandler(index)
            }}
            data-uk-icon="close"
          />
        ) : null}
      </div>
    </div>
  )
}

export default SocialMediaSettings
