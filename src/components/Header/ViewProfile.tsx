import React from 'react'

import './ViewProfile.css'

const ViewProfile = () => (
  <div>
    <div id="cover-photo">
      <span id="header-icon" data-uk-icon="ban" />
      <span id="header-icon" data-uk-icon="mail" />
      <span id="header-icon" data-uk-icon="plus" />
    </div>
    <div id="header-tab">
      <ul data-uk-tab>
        <li className="uk-active">
          <a href="#">Profile</a>
        </li>
        <li>
          <a href="#">Store</a>
        </li>
        <li>
          <a href="#">Followers</a>
        </li>
        <li>
          <a href="#">Following</a>
        </li>
      </ul>
    </div>
  </div>
)

export default ViewProfile
