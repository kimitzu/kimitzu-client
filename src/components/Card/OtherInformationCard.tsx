import React from 'react'

import './OtherInformationCard.css'

import { Profile } from '../../interfaces/Profile'

interface OtherInformationCardInterface {
  data: Profile
}

const OtherInformationCard = (props: OtherInformationCardInterface) => (
  <div className="uk-margin-bottom">
    <div className="uk-card uk-card-default uk-card-body">
      <h3 id="title-other-information" className="uk-card-title">
        Other Information
      </h3>
      <div id="information">
        {props.data.customFields.map(customField => (
          <>
            <p id="information-title" className="uk-text-capitalize">
              {customField.label}
            </p>
            <p>{customField.value}</p>
          </>
        ))}
        <p id="information-title">Peer ID</p>
        <p> {props.data.peerID!}</p>
        <p id="information-title">Location</p>
        <p> {props.data.location || 'Location not specified'} </p>
        <p id="information-title">Username</p>
        <p> {props.data.handle} </p>
      </div>
    </div>
  </div>
)

export default OtherInformationCard
