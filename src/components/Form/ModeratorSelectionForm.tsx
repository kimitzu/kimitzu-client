import React, { useState } from 'react'

import { ModeratorCard } from '../Card'
import { DottedSpinner } from '../Spinner'

import Profile from '../../models/Profile'

import './ModeratorSelectionForm.css'

interface Props {
  selectedModerators: Profile[]
  availableModerators: Profile[]
  handleModeratorSearch: (value: string) => void
  handleBtnClick: (profile: Profile, index: number, type: string) => void
  handleMoreInfo: (profile: Profile) => void
  handleSubmit: () => void
  showSpinner?: boolean
  submitLabel?: string
  handleFullSubmit?: (event: React.FormEvent) => void
  isNew?: boolean
}

const ModeratorSelectionForm = ({
  availableModerators,
  handleBtnClick,
  handleModeratorSearch,
  handleMoreInfo,
  handleSubmit,
  selectedModerators,
  showSpinner,
  submitLabel,
  handleFullSubmit,
  isNew,
}: Props) => {
  const [searchVal, setSearchVal] = useState('')
  return (
    <div className="uk-width-1-1">
      <div className="uk-inline uk-width-1-1">
        <input
          id="moderator-search"
          className="uk-input"
          type="text"
          value={searchVal}
          onChange={e => {
            const { value } = e.target
            setSearchVal(value)
            handleModeratorSearch(value)
          }}
          placeholder="Search by moderator ID"
        />
        <a
          className="uk-form-icon uk-form-icon-flip"
          data-uk-icon="icon: close"
          hidden={searchVal.length === 0}
          onClick={() => {
            setSearchVal('')
            handleModeratorSearch('')
          }}
        />
      </div>
      <div
        className="uk-padding-remove uk-panel-scrollable"
        id="moderator-selection-dropdown"
        data-uk-dropdown="pos: bottom-justify; mode: click"
      >
        {showSpinner && searchVal.length === 0 ? (
          <div className="uk-flex uk-flex-middle uk-flex-center uk-height-1-1">
            <DottedSpinner />
          </div>
        ) : availableModerators.length === 0 ? (
          <div className="uk-flex uk-flex-middle uk-flex-center uk-height-1-1">
            <h5>No moderators found or available.</h5>
          </div>
        ) : (
          <ul className="uk-nav uk-dropdown-nav uk-width-1-1 uk-list">
            {availableModerators.map((moderator, index) => (
              <li
                id={`moderator-${moderator.peerID}`}
                key={moderator.peerID}
                className="uk-margin-remove"
              >
                <ModeratorCard profile={moderator}>
                  <div className="uk-flex uk-flex-column uk-flex-1 uk-flex-center uk-flex-middle">
                    <button
                      id={`moderator-add-${moderator.peerID}`}
                      className="uk-button uk-button-primary"
                      onClick={() => handleBtnClick(moderator, index, 'add')}
                    >
                      +
                    </button>

                    <a
                      id={`moderator-info-${moderator.peerID}`}
                      className="moderator-card-more-link"
                      onClick={() => handleMoreInfo(moderator)}
                    >
                      More...
                    </a>
                  </div>
                </ModeratorCard>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div
        id="selected-moderators"
        className="uk-margin-top uk-panel uk-panel-scrollable uk-padding-remove"
      >
        {selectedModerators.map((moderator, index) => (
          <div className="uk-margin-small-top" key={moderator.peerID}>
            <ModeratorCard profile={moderator}>
              <div className="uk-flex uk-flex-column uk-flex-1 uk-flex-center uk-flex-middle">
                <button
                  id={`moderator-remove-${moderator.peerID}`}
                  className="uk-button uk-button-primary moderator-card-btn"
                  onClick={() => handleBtnClick(moderator, index, 'remove')}
                >
                  {`\xD7`}
                </button>

                <a id="moderator-card-more-link" onClick={() => handleMoreInfo(moderator)}>
                  More...
                </a>
              </div>
            </ModeratorCard>
          </div>
        ))}
      </div>
      <div className="submit-btn-div uk-margin-top">
        {!isNew ? (
          <button
            className="uk-button uk-button-primary uk-margin-small-right"
            onClick={handleFullSubmit}
          >
            UPDATE LISTING
          </button>
        ) : null}
        <button
          className={`uk-button ${isNew ? 'uk-button-primary' : 'uk-button-default'}`}
          onClick={handleSubmit}
        >
          {submitLabel || 'NEXT'}
        </button>
      </div>
    </div>
  )
}

export default ModeratorSelectionForm
