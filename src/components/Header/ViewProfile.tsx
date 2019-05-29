import React from 'react'

import './ViewProfile.css'

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
  </div>
)

export default ViewProfile
