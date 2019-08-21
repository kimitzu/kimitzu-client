import React from 'react'

import './ViewProfile.css'

import config from '../../config'
import Listing from '../../models/Listing'
import Profile from '../../models/Profile'
import AboutCard from '../Card/Profile/AboutCard'
import ListingCardGroup from '../CardGroup/ListingCardGroup'

interface ViewProfileInterface {
  profile: Profile
  listings: Listing[]
  isOwner: boolean
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
          {props.profile.avatarHashes.medium ? (
            <img
              src={`${config.openBazaarHost}/ob/images/${
                props.profile.avatarHashes ? props.profile.avatarHashes.medium : ''
              }`}
            />
          ) : (
            <div uk-spinner="ratio: 3" />
          )}
        </div>
        {props.profile.name ? (
          <div id="header-tab">
            <div id="seller-name">
              <h3> {props.profile.name} </h3>
            </div>
            <ul data-uk-tab="connect: #container-profile">
              <li className="uk-active">
                <a href="#" id="tab-label">
                  Profile
                </a>
              </li>
              <li>
                <a href="#" id="tab-label">
                  Store <span id="label-number"> {props.profile.stats!.listingCount} </span>
                </a>
              </li>
              <li>
                <a href="#" id="tab-label">
                  Followers <span id="label-number"> {props.profile.stats!.followerCount} </span>
                </a>
              </li>
              <li>
                <a href="#" id="tab-label">
                  Following <span id="label-number"> {props.profile.stats!.followingCount} </span>
                </a>
              </li>
              {props.isOwner ? (
                <>
                  <li>
                    <a
                      href="/history/sales"
                      id="tab-label"
                      onClick={() => {
                        window.location.hash = '/history/sales'
                      }}
                    >
                      Sales History
                    </a>
                  </li>
                  <li>
                    <a
                      id="tab-label"
                      onClick={() => {
                        window.location.hash = '/history/purchases'
                      }}
                    >
                      Purchase History
                    </a>
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>
      <ul id="container-profile" className="uk-switcher">
        <li>
          <AboutCard profile={props.profile} />
        </li>
        <li>
          <ListingCardGroup data={props.listings} />
        </li>
        <li>Coming soon!</li>
        <li>Coming soon!</li>
        <li>Redirecting...</li>
        <li>Redirecting...</li>
      </ul>
    </div>
  )
}

export default ViewProfile
