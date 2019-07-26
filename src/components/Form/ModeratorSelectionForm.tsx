import React from 'react'

import { ModeratorCard } from '../Card'

import Profile from '../../models/Profile'

interface Props {
  selectedModerators: Profile[]
  availableModerators: Profile[]
  handleAddBtn: (profile: Profile) => void
  handleMoreInfo: (profile: Profile) => void
}

const ModeratorSelectionForm = ({
  availableModerators,
  handleAddBtn,
  handleMoreInfo,
  selectedModerators,
}: Props) => (
  <div className="uk-width-1-1">
    <input className="uk-input" type="text" placeholder="Search moderators" />
    <div
      className="uk-padding-remove uk-panel-scrollable"
      style={{ height: '400px' }}
      data-uk-dropdown="pos: bottom-justify; mode: click"
    >
      <ul className="uk-nav uk-dropdown-nav uk-width-1-1 uk-list">
        {availableModerators.map(moderator => (
          <li key={moderator.peerID}>
            <ModeratorCard
              handleAddBtn={handleAddBtn}
              handleMoreInfo={handleMoreInfo}
              profile={moderator}
            />
          </li>
        ))}
      </ul>
    </div>
    <div className="uk-margin-top">
      {selectedModerators.map(moderator => (
        <div className="uk-margin-small-top" key={moderator.peerID}>
          <ModeratorCard
            handleAddBtn={handleAddBtn}
            handleMoreInfo={handleMoreInfo}
            profile={moderator}
          />
        </div>
      ))}
    </div>
  </div>
)

export default ModeratorSelectionForm
