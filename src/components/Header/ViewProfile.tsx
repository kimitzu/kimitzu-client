import React from 'react'

import './ViewProfile.css'

import config from '../../config'
import Listing from '../../models/Listing'
import Profile from '../../models/Profile'
import AboutCard from '../Card/Profile/AboutCard'
import ListingCardGroup from '../CardGroup/ListingCardGroup'

interface ViewProfileInterface {
  data: Profile
  listings: Listing[]
}

const ViewProfile = (props: ViewProfileInterface) => {
  return (
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
          <ul data-uk-tab="connect: #container-profile">
            <li className="uk-active">
              <a href="#" id="tab-label">
                Profile
              </a>
            </li>
            <li>
              <a href="#" id="tab-label">
                Store <span id="label-number"> {props.data.stats!.listingCount} </span>
              </a>
            </li>
            <li>
              <a href="#" id="tab-label">
                Followers <span id="label-number"> {props.data.stats!.followerCount} </span>
              </a>
            </li>
            <li>
              <a href="#" id="tab-label">
                Following <span id="label-number"> {props.data.stats!.followingCount} </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <ul id="container-profile" className="uk-switcher">
        <li>
          <AboutCard data={props.data} />
        </li>
        <li>
          <ListingCardGroup data={props.listings} />
        </li>
        <li>Coming soon!</li>
        <li>Coming soon!</li>
      </ul>
    </div>
  )
}

export default ViewProfile
