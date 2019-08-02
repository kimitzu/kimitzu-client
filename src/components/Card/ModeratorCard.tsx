import React from 'react'

import Profile from '../../models/Profile'

import './ModeratorCard.css'

interface Props {
  profile: Profile
  children?: JSX.Element | JSX.Element[]
  handleSelect?: () => void
  currIndex?: string
  id?: string
}

const ModeratorCard = ({ profile, children, id, currIndex, handleSelect }: Props) => {
  const { moderatorInfo, location } = profile
  const primaryAddress = location || 'Not Specified'

  return (
    <div
      className={`uk-card uk-card-default uk-width-1-1 ${currIndex === id ? 'bar-select' : ''}`}
      onClick={() => (handleSelect ? handleSelect() : null)}
    >
      <div className="uk-card-body uk-flex uk-padding-small">
        <div className="uk-flex-2 uk-flex uk-flex-center uk-flex-middle">
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
              {profile.displayModeratorFee}&nbsp;
              <span data-uk-icon="location" />
              {primaryAddress}
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

export default ModeratorCard
