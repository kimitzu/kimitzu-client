import React from 'react'

import './OtherInformationCard.css'

import { Profile } from '../../models/Profile'

interface OtherInformationCardInterface {
  data: Profile
}

const OtherInformationCard = (props: OtherInformationCardInterface) => (
  <div id="profile-other-information">
    <div className="uk-card uk-card-default uk-card-body">
      <h3 id="title-other-information" className="uk-card-title">
        Other Information
      </h3>
      <div id="information">
        <p id="information-title">Peer ID</p>
        <p> {props.data.peerID!}</p>
        <p id="information-title">Location</p>
        <p>
          {' '}
          {props.data.extLocation.addresses[props.data.extLocation.primary].country ||
            'Location not specified'}{' '}
        </p>
        <p id="information-title">Email</p>
        <p> johndoe@djali.com </p>
        <p id="information-title">Username</p>
        <p> {props.data.handle} </p>
      </div>
    </div>
  </div>
)

export default OtherInformationCard
