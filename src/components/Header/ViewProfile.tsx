import React from 'react'

import './ViewProfile.css'

import OtherInformationCard from './../Card/OtherInformationCard'
import ProfessionalBackgroundCard from './../Card/ProfessionalBackgroundCard'
import SocialMediaCard from './../Card/SocialMediaCard'

import config from '../../config'
import { Profile } from '../../models/Profile'

interface ViewProfileInterface {
  data: Profile
}

const ViewProfile = (props: ViewProfileInterface) => (
  <div>
    <div id="cover-photo">
      <span id="header-icon" data-uk-icon="ban" />
      <span id="header-icon" data-uk-icon="mail" />
      <span id="header-icon" data-uk-icon="plus" />
    </div>
    <div id="header">
      <div id="profile-picture">
        <img
          src={`${config.openBazaarHost}/ob/images/${
            props.data.avatarHashes ? props.data.avatarHashes.medium : ''
          }`}
        />
      </div>
      <div id="header-tab">
        <div id="seller-name">
          <h3> {props.data.name} </h3>
        </div>
        <ul data-uk-tab>
          <li className="uk-active">
            <a href="#" id="tab-label">
              Profile
            </a>
          </li>
          <li>
            <a href="#" id="tab-label">
              Store <span id="label-number"> 28 </span>
            </a>
          </li>
          <li>
            <a href="#" id="tab-label">
              Followers <span id="label-number"> 55 </span>
            </a>
          </li>
          <li>
            <a href="#" id="tab-label">
              Following <span id="label-number"> 36 </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div id="profile-about">
      <div className="uk-card uk-card-default uk-card-body">
        <h3 id="title-about" className="uk-card-title">
          About
        </h3>
        <p>{props.data.about}</p>
      </div>
    </div>
    <SocialMediaCard />
    <ProfessionalBackgroundCard />
    <OtherInformationCard data={props.data} />
  </div>
)

export default ViewProfile
