import React from 'react'

import './SocialMediaCard.css'

const SocialMediaCard = () => (
  <div id="profile-social-media">
    <div className="uk-card uk-card-default uk-card-body">
      <h3 id="title-social-media" className="uk-card-title">
        Social Media
      </h3>
      <div id="social-media">
        <div id="account-icon">
          <span uk-icon="icon: linkedin" />
        </div>
        <div id="account-name">
          <p> Linkedln </p>
          <a href="#"> https://linkedin.com/myprofile </a>
        </div>
      </div>
      <div id="social-media">
        <div id="account-icon">
          <span uk-icon="icon: facebook" />
        </div>
        <div id="account-name">
          <p> Facebook </p>
          <a href="#"> https://facebook.com/myprofile </a>
        </div>
      </div>
      <div id="social-media">
        <div id="account-icon">
          <span uk-icon="icon: twitter" />
        </div>
        <div id="account-name">
          <p> Twitter </p>
          <a href="#"> https://twitter.com/myprofile </a>
        </div>
      </div>
    </div>
  </div>
)

export default SocialMediaCard
