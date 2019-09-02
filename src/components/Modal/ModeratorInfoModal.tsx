import ISO6391 from 'iso-639-1'
import React from 'react'
import ReactCountryFlag from 'react-country-flag'

import Profile from '../../models/Profile'

import './ModeratorInfoModal.css'

interface Props {
  profile: Profile
}

const ModeratorInfoModal = ({ profile }: Props) => {
  const { moderatorInfo, extLocation, name, peerID } = profile
  const primaryAddress = extLocation ? extLocation.addresses[extLocation.primary] : null

  if (!moderatorInfo) {
    return null
  }

  const { acceptedCurrencies, description, languages, termsAndConditions } = moderatorInfo

  return (
    <div id="moderator-info" className="uk-flex-top" data-uk-modal>
      <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <button
          id="moderator-info-close"
          className="uk-modal-close-default"
          type="button"
          data-uk-close
        />
        <div className="uk-flex">
          <div className="uk-flex uk-flex-column uk-flex-1 uk-flex-middle uk-flex-center">
            <img
              className="uk-border-circle"
              id="moderator-info-img"
              src={profile.getAvatarSrc()}
            />
            <div className="uk-flex uk-flex-center uk-margin-small-top">
              <button
                id="moderator-info-button"
                className="uk-button uk-button-primary"
                onClick={() => {
                  const dmEvent = new CustomEvent('dm', { detail: profile })
                  window.dispatchEvent(dmEvent)
                }}
              >
                MESSAGE
              </button>
            </div>
          </div>
          <div className="uk-flex-3 uk-flex-row">
            <h3 className="uk-text-bold">{name}</h3>
            <p className="color-secondary" id="moderator-info-location">
              {primaryAddress ? (
                <>
                  <span data-uk-icon="location" />
                  {`${primaryAddress.city}, ${primaryAddress.state}, ${primaryAddress.country}`}
                </>
              ) : null}
            </p>
            <div className="uk-margin-small-top uk-flex uk-flex-column">
              <div
                id="moderator-info-table-header"
                className="uk-flex uk-flex-row uk-flex-middle uk-flex-center"
              >
                <div className="uk-flex-1">
                  <p>FEE</p>
                </div>
                {acceptedCurrencies ? (
                  <div className="uk-flex-1">
                    <p>Currencies</p>
                  </div>
                ) : null}
                <div className="uk-flex-1">
                  <p>Languages</p>
                </div>
              </div>
              <div id="moderator-info-table-body" className="uk-flex uk-flex-row">
                <div className="uk-flex-1">
                  <p>{profile.displayModeratorFee}</p>
                </div>
                {acceptedCurrencies ? (
                  <div className="uk-flex-1">
                    <p>
                      {acceptedCurrencies.map((currency: string) => {
                        return `${currency.slice(1)} `
                      })}
                    </p>
                  </div>
                ) : null}

                <div className="uk-flex-1">
                  {languages.map((language: string) => {
                    const [langCode, countryCode] = language.split('-')
                    return (
                      <div key={langCode}>
                        <p>
                          <ReactCountryFlag code={countryCode} svg /> {ISO6391.getName(langCode)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="uk-margin-small-top">
          <p>{description}</p>
        </div>
        <div className="uk-margin-small-top">
          <h5 className="uk-text-bold">Terms and Conditions</h5>
          <p id="moderator-info-terms">{termsAndConditions}</p>
        </div>
      </div>
    </div>
  )
}

export default ModeratorInfoModal
