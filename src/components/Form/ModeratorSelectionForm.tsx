import React, { useEffect, useState } from 'react'

import { ModeratorCard } from '../Card'
import { DottedSpinner } from '../Spinner'

import Profile from '../../models/Profile'

import { ModeratorManager } from '../../models/ModeratorManager'
import { Button } from '../Button'

import { localeInstance } from '../../i18n'

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
  hideFavorites?: boolean
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
  hideFavorites,
}: Props) => {
  const {
    localizations,
    localizations: { moderatorSelectionForm, listingForm },
  } = localeInstance.get
  const [searchVal, setSearchVal] = useState('')
  const [delayedComponent, setDelayedComponent] = useState(<></>)
  const dropdownRef = React.createRef<HTMLDivElement>()

  if (!timeoutFunction) {
    timeoutFunction = setTimeout(() => {
      setDelayedComponent(
        <>
          <hr />
          <p>{moderatorSelectionForm.crawlingNotif1}</p>
          <p>{moderatorSelectionForm.crawlingNotif2}</p>
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
              className="moderator-card-btn uk-button uk-button-primary"
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
              onClick={evt => {
                evt.preventDefault()
                handleMoreInfo(moderator)
              }}
              href="/#"
            >
              {moderatorSelectionForm.showDetailsLink}
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
          placeholder={moderatorSelectionForm.searchPlaceholder}
        />
        <a
          href="/#"
          className="uk-form-icon uk-form-icon-flip"
          data-uk-icon="icon: close"
          hidden={searchVal.length === 0}
          onClick={evt => {
            evt.preventDefault()
            setSearchVal('')
            handleModeratorSearch('')
          }}
        >
          &nbsp;
        </a>
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
              <p>{moderatorSelectionForm.searchSpinnerText}</p>
              {delayedComponent}
            </DottedSpinner>
          </div>
        ) : moderatorManager.availableModerators.length === 0 &&
          moderatorManager.favoriteModerators.length === 0 &&
          moderatorManager.recentModerators.length === 0 ? (
          <div className="uk-flex uk-flex-middle uk-flex-center uk-height-1-1">
            <h5>{moderatorSelectionForm.noResultsHeader}</h5>
          </div>
        ) : (
          <div className="moderator-list">
            {searchVal ? (
              <>
                <p className="title">{moderatorSelectionForm.resultsParagraph}</p>

                {moderatorManager.searchResultModerators.length > 0 ? (
                  <ul className="uk-nav uk-dropdown-nav uk-list uk-margin-small-top">
                    {moderatorManager.searchResultModerators.map((moderator, index) =>
                      generateModeratorCard('searchResultModerators', moderator, index)
                    )}
                  </ul>
                ) : (
                  <>
                    <p className="uk-text-center">
                      {moderatorSelectionForm.noResultsParagraph}
                      <span className="uk-text-bold">{searchVal}</span>
                    </p>
                  </>
                )}
              </>
            ) : null}
            {moderatorManager.favoriteModerators.length > 0 && !hideFavorites ? (
              <>
                <p className="title">{moderatorSelectionForm.favouriteSeparatorText}</p>

                <ul className="uk-nav uk-dropdown-nav uk-list uk-margin-small-top">
                  {moderatorManager.favoriteModerators.map((moderator, index) =>
                    generateModeratorCard('favoriteModerators', moderator, index)
                  )}
                </ul>
              </>
            ) : null}
            {moderatorManager.recentModerators.length > 0 ? (
              <>
                <p className="title">{moderatorSelectionForm.recentSeparatorText}</p>

                <ul className="uk-nav uk-dropdown-nav uk-list uk-margin-small-top">
                  {moderatorManager.recentModerators.map((moderator, index) =>
                    generateModeratorCard('recentModerators', moderator, index)
                  )}
                </ul>
              </>
            ) : null}
            {moderatorManager.availableModerators.length > 0 ? (
              <>
                <p className="title">{moderatorSelectionForm.availableSeparatorText}</p>

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
                  className="moderator-card-btn uk-button uk-button-primary"
                  onClick={() => handleRemoveModerator(moderator, index)}
                >
                  <span uk-icon="icon: close" />
                </Button>

                <a
                  id="moderator-card-more-link"
                  onClick={evt => {
                    evt.preventDefault()
                    handleMoreInfo(moderator)
                  }}
                  href="/#"
                >
                  {moderatorSelectionForm.showDetailsLink}
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
            {listingForm.updateBtnText.toUpperCase()}
          </Button>
        ) : null}
        <Button
          className={`uk-button ${isNew || !isListing ? 'uk-button-primary' : 'uk-button-default'}`}
          onClick={handleSubmit}
        >
          {submitLabel || localizations.nextBtnText.toUpperCase()}
        </Button>
      </div>
    </div>
  )
}

export default ModeratorSelectionForm
