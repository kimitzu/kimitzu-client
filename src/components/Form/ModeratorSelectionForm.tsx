import React from 'react'

import { ModeratorCard } from '../Card'

import Profile from '../../models/Profile'

import './ModeratorSelectionForm.css'

interface Props {
  selectedModerators: Profile[]
  availableModerators: Profile[]
  handleModeratorSearch: (value: string) => void
  handleBtnClick: (profile: Profile, index: number, type: string) => void
  handleMoreInfo: (profile: Profile) => void
  handleSubmit: () => void
}

const ModeratorSelectionForm = ({
  availableModerators,
  handleBtnClick,
  handleModeratorSearch,
  handleMoreInfo,
  handleSubmit,
  selectedModerators,
}: Props) => (
  <div className="uk-width-1-1">
    <input
      className="uk-input"
      type="text"
      onChange={e => handleModeratorSearch(e.target.value)}
      placeholder="Search by moderator ID"
    />
    <div
      className="uk-padding-remove uk-panel-scrollable"
      style={{ height: '400px' }}
      data-uk-dropdown="pos: bottom-justify; mode: click"
    >
      <ul className="uk-nav uk-dropdown-nav uk-width-1-1 uk-list">
        {availableModerators.map((moderator, index) => (
          <li key={moderator.peerID} className="uk-margin-remove">
            <ModeratorCard
              index={index}
              handleBtnClick={handleBtnClick}
              handleMoreInfo={handleMoreInfo}
              profile={moderator}
              addModerator
            />
          </li>
        ))}
      </ul>
    </div>
    <div
      id="selected-moderators"
      className="uk-margin-top uk-panel uk-panel-scrollable uk-padding-remove"
    >
      {selectedModerators.map((moderator, index) => (
        <div className="uk-margin-small-top" key={moderator.peerID}>
          <ModeratorCard
            index={index}
            handleBtnClick={handleBtnClick}
            handleMoreInfo={handleMoreInfo}
            profile={moderator}
          />
        </div>
      ))}
    </div>
    <div className="submit-btn-div uk-margin-top">
      <button className="uk-button uk-button-primary" onClick={handleSubmit}>
        CONTINUE
      </button>
    </div>
  </div>
)

export default ModeratorSelectionForm
