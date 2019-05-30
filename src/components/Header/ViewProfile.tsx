import React from 'react'

import './ViewProfile.css'

import ProfessionalBackgroundCard from './../Card/ProfessionalBackgroundCard'
import SocialMediaCard from './../Card/SocialMediaCard'

const ViewProfile = () => (
  <div>
    <div id="cover-photo">
      <span id="header-icon" data-uk-icon="ban" />
      <span id="header-icon" data-uk-icon="mail" />
      <span id="header-icon" data-uk-icon="plus" />
    </div>
    <div id="header">
      <div id="profile-picture">
        <img src="https://profilepicturesdp.com/wp-content/uploads/2018/07/profile-avatar-pictures-6.png" />
      </div>
      <div id="header-tab">
        <div id="seller-name">
          <h3> Anonymous Seller </h3>
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
        <p>
          Lorem ipsum sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Lorem ipsum sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut bore et dolore magna
          aliqua. Lorem ipsum sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
    <SocialMediaCard />
    <ProfessionalBackgroundCard />
    <ProfessionalBackgroundCard />
  </div>
)

export default ViewProfile
