import React from 'react'

import Profile from '../../models/Profile'

import './ModeratorCard.css'

interface Props {
  index: number
  profile: Profile
  handleBtnClick: (profile: Profile, index: number, type: string) => void
  handleMoreInfo: (profile: Profile) => void
  addModerator?: boolean
}

const displayFee = fee => {
  const { feeType, fixedFee, percentage } = fee
  const fixed = `${fixedFee.amount}${fixedFee.currencyCode}`
  const percent = `${percentage}%`
  switch (feeType) {
    case 'FIXED':
      return fixed
    case 'PERCENTAGE':
      return percent
    case 'FIXED_PLUS_PERCENTAGE':
      return `${fixed} + ${percent}`
    default:
      return '0'
  }
}

const ModeratorCard = ({ index, handleBtnClick, handleMoreInfo, profile, addModerator }: Props) => {
  const { moderatorInfo, location } = profile
  const primaryAddress = location || 'Not Specified'
  const { fee } = moderatorInfo
  return (
    <div className="uk-card uk-card-default uk-width-1-1">
      <div className="uk-card-body uk-flex uk-padding-small">
        <div className="uk-flex-2">
          <img id="moderator-card-img" src={profile.getAvatarSrc()} />
        </div>
        <div id="moderator-card-content" className="uk-padding-small uk-padding-remove-vertical">
          <h3 className="uk-card-title uk-text-bold">{profile.name}</h3>
          <p id="moderator-card-description" className="uk-text-truncate uk-text-muted">
            {moderatorInfo.description}
          </p>
          <div className="uk-flex">
            <p id="moderator-card-fees" className="uk-flex-1 uk-text-bold">
              <span data-uk-icon="tag" />
              {displayFee(fee)}
              {primaryAddress}
            </p>
          </div>
        </div>
        <div className="uk-flex uk-flex-column uk-flex-1 uk-flex-center uk-flex-middle">
          <button
            id="moderator-card-btn"
            className="uk-button uk-button-primary"
            onClick={() => handleBtnClick(profile, index, addModerator ? 'add' : 'remove')}
          >
            {addModerator ? '+' : `\xD7`}
          </button>

          <a id="moderator-card-more-link" onClick={() => handleMoreInfo(profile)}>
            More...
          </a>
        </div>
      </div>
    </div>
  )
}

export default ModeratorCard
