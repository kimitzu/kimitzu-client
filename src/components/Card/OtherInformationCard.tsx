import React from 'react'

import { Profile } from '../../interfaces/Profile'

import { localeInstance } from '../../i18n'

import './OtherInformationCard.css'

interface OtherInformationCardInterface {
  data: Profile
}

const OtherInformationCard = (props: OtherInformationCardInterface) => {
  const {
    localizations,
    localizations: { profilePage },
  } = localeInstance.get

  return (
    <div className="uk-margin-bottom">
      <div className="uk-card uk-card-default uk-card-body">
        <h3 id="title-other-information" className="uk-card-title">
          {profilePage.othersHeader}
        </h3>
        <div id="information">
          {props.data.customFields.map(customField => (
            <React.Fragment key={customField.label}>
              <p id="information-title" className="uk-text-capitalize">
                {customField.label}
              </p>
              <p>{customField.value}</p>
            </React.Fragment>
          ))}
          <p id="information-title">{localizations.peerID}</p>
          <p> {props.data.peerID!}</p>
          <p id="information-title">{localizations.locationLabel}</p>
          <p> {props.data.location || profilePage.noLocationParagraph} </p>
          <p id="information-title">{localizations.usernameLabel}</p>
          <p> {props.data.handle} </p>
        </div>
      </div>
    </div>
  )
}

export default OtherInformationCard
