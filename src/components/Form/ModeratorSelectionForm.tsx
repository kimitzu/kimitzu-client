import React, { useEffect, useState } from 'react'

import { ModeratorCard } from '../Card'
import { DottedSpinner } from '../Spinner'

import Profile from '../../models/Profile'

import { ModeratorManager, moderatorManagerInstance } from '../../models/ModeratorManager'
import { Button } from '../Button'
import './ModeratorSelectionForm.css'

interface Props {
  moderatorManager: ModeratorManager
  handleModeratorSearch: (value: string) => void
  handleSelectModerator: (moderator: Profile, moderatorSource: string, index: number) => void
  handleRemoveModerator: (moderator: Profile, index: number) => void
  handleMoreInfo: (profile: Profile) => void
  handleSubmit: () => void
  showSpinner?: boolean
  submitLabel?: string
  handleFullSubmit?: (event: React.FormEvent) => void
  isNew?: boolean
  isListing?: boolean
}

let timeoutFunction

const ModeratorSelectionForm = ({
  handleSelectModerator,
  handleRemoveModerator,
  handleModeratorSearch,
  handleMoreInfo,
  handleSubmit,
  showSpinner,
  submitLabel,
  handleFullSubmit,
  isNew,
  isListing,
  moderatorManager,
}: Props) => {
  const [searchVal, setSearchVal] = useState('')
  const [delayedComponent, setDelayedComponent] = useState(<></>)
  const dropdownRef = React.createRef<HTMLDivElement>()

  if (!timeoutFunction) {
    timeoutFunction = setTimeout(() => {
      setDelayedComponent(
        <>
          <hr />
          <p>It is taking a while to crawl the network for available moderators.</p>
          <p>Please wait a little longer or come back later.</p>
        </>
      )
    }, 10000)
  }

  useEffect(() => {
    if (moderatorManager.selectedModerators.length <= 0 && dropdownRef) {
      window.UIkit.dropdown(dropdownRef.current).show()
    }
  }, [])

  const generateModeratorCard = (moderatorSource, moderator, index) => {
    return (
      <li
        id={`${moderatorSource}-${moderator.peerID}`}
        key={moderator.peerID}
        className="uk-margin-remove"
      >
        <ModeratorCard profile={moderator}>
          <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
            <Button
              id={`${moderatorSource}-add-${moderator.peerID}`}
              className="uk-button uk-button-primary"
              onClick={() => {
                window.UIkit.dropdown(dropdownRef.current).hide()
                handleSelectModerator(moderator, moderatorSource, index)
              }}
            >
              <span uk-icon="icon: plus" />
            </Button>

            <a
              id={`${moderatorSource}-info-${moderator.peerID}`}
              className="moderator-card-more-link"
              onClick={() => handleMoreInfo(moderator)}
            >
              More...
            </a>
          </div>
        </ModeratorCard>
      </li>
    )
  }

  return (
    <div>
      <div className="uk-inline uk-width-1-1">
        <input
          id="moderator-search"
          className="uk-input"
          type="text"
          value={searchVal}
          onChange={e => {
            const { value } = e.target
            window.UIkit.dropdown(dropdownRef.current).show()
            setSearchVal(value)
            handleModeratorSearch(value)
          }}
          onClick={() => {
            window.UIkit.dropdown(dropdownRef.current).show()
          }}
          placeholder="Search by moderator name or ID"
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
        data-uk-dropdown="pos: bottom-justify; mode: click; offset: 0"
        ref={dropdownRef}
      >
        {showSpinner && searchVal.length === 0 ? (
          <div className="uk-flex uk-flex-middle uk-flex-center uk-flex-column uk-height-1-1">
            <DottedSpinner>
              <p>Searching the network for moderators...</p>
              {delayedComponent}
            </DottedSpinner>
          </div>
        ) : moderatorManager.availableModerators.length === 0 &&
          moderatorManager.favoriteModerators.length === 0 &&
          moderatorManager.recentModerators.length === 0 ? (
          <div className="uk-flex uk-flex-middle uk-flex-center uk-height-1-1">
            <h5>No moderators found or available.</h5>
          </div>
        ) : (
          <div className="moderator-list">
            {moderatorManager.searchResultModerators.length > 0 ? (
              <>
                <p className="title">Search Result</p>

                <ul className="uk-nav uk-dropdown-nav uk-list uk-margin-small-top">
                  {moderatorManager.searchResultModerators.map((moderator, index) =>
                    generateModeratorCard('searchResultModerators', moderator, index)
                  )}
                </ul>
              </>
            ) : null}
            {moderatorManager.favoriteModerators.length > 0 ? (
              <>
                <p className="title">Favorites</p>

                <ul className="uk-nav uk-dropdown-nav uk-list uk-margin-small-top">
                  {moderatorManager.favoriteModerators.map((moderator, index) =>
                    generateModeratorCard('favoriteModerators', moderator, index)
                  )}
                </ul>
              </>
            ) : null}
            {moderatorManager.recentModerators.length > 0 ? (
              <>
                <p className="title">Recent</p>

                <ul className="uk-nav uk-dropdown-nav uk-list uk-margin-small-top">
                  {moderatorManager.recentModerators.map((moderator, index) =>
                    generateModeratorCard('recentModerators', moderator, index)
                  )}
                </ul>
              </>
            ) : null}
            {moderatorManager.availableModerators.length > 0 ? (
              <>
                <p className="title">Available</p>

                <ul className="uk-nav uk-dropdown-nav uk-list uk-margin-small-top">
                  {moderatorManager.availableModerators.map((moderator, index) =>
                    generateModeratorCard('availableModerators', moderator, index)
                  )}
                </ul>
              </>
            ) : null}
          </div>
        )}
      </div>
      <div
        id="selected-moderators"
        className="uk-margin-top uk-panel uk-panel-scrollable uk-padding-remove"
      >
        {moderatorManager.selectedModerators.map((moderator, index) => (
          <div className="uk-margin-small-top" key={moderator.peerID}>
            <ModeratorCard profile={moderator}>
              <div className="uk-flex uk-flex-column uk-flex-1 uk-flex-center uk-flex-middle">
                <Button
                  id={`moderator-remove-${moderator.peerID}`}
                  className="uk-button uk-button-primary moderator-card-btn"
                  onClick={() => handleRemoveModerator(moderator, index)}
                >
                  <span uk-icon="icon: close" />
                </Button>

                <a id="moderator-card-more-link" onClick={() => handleMoreInfo(moderator)}>
                  More...
                </a>
              </div>
            </ModeratorCard>
          </div>
        ))}
      </div>
      <div className="submit-btn-div uk-margin-top">
        {!isNew && isListing ? (
          <Button
            className="uk-button uk-button-primary uk-margin-small-right"
            onClick={handleFullSubmit}
          >
            UPDATE LISTING
          </Button>
        ) : null}
        <Button
          className={`uk-button ${isNew || !isListing ? 'uk-button-primary' : 'uk-button-default'}`}
          onClick={handleSubmit}
        >
          {submitLabel || 'NEXT'}
        </Button>
      </div>
    </div>
  )
}

export default ModeratorSelectionForm
