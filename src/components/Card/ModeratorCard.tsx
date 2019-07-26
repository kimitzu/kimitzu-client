import React from 'react'

import Profile from '../../models/Profile'

import './ModeratorCard.css'

interface Props {
  profile: Profile
  handleAddBtn: (profile: Profile) => void
  handleMoreInfo: (profile: Profile) => void
}

const ModeratorCard = ({ handleAddBtn, handleMoreInfo, profile }: Props) => {
  const { moderatorInfo } = profile
  const { fee } = moderatorInfo
  return (
    <div className="uk-card uk-card-default uk-width-1-1">
      <div className="uk-card-body uk-flex uk-padding-small">
        <div className="uk-flex-2">
          <img id="moderator-card-img" src={profile.getAvatarSrc()} />
        </div>
        <div id="moderator-card-content">
          <h3 className="uk-card-title uk-text-bold">{profile.name}</h3>
          <div className="uk-flex">
            <p className="uk-flex-1 uk-text-bold">
              Fee: {`${fee.fixedFee ? fee.fixedFee.amount + fee.fixedFee.currencyCode : ''}`}
              {fee.feeType === 'FIXED_PLUS_PERCENTAGE'
                ? ` + ${fee.percentage}%`
                : `${fee.percentage}%`}
            </p>
            <p className="uk-text-bold uk-flex-3">
              Currencies:{' '}
              {moderatorInfo.acceptedCurrencies
                ? moderatorInfo.acceptedCurrencies.toString()
                : 'N/A'}
            </p>
          </div>
          <p>{moderatorInfo.description}</p>
        </div>
        <div className="uk-flex uk-flex-column uk-flex-1 uk-flex-center uk-flex-middle">
          <button
            id="moderator-card-btn"
            className="uk-button uk-button-primary"
            onClick={() => handleAddBtn(profile)}
          >
            +
          </button>
          <a onClick={() => handleMoreInfo(profile)}>INFO</a>
        </div>
      </div>
    </div>
  )
}

export default ModeratorCard
