import React from 'react'

import Profile from '../../models/Profile'

import config from '../../config'

import './ProfileHeader.css'

interface ViewProfileInterface {
  profile: Profile
  isOwner: boolean
}

const ProfileHeader = ({ profile, isOwner }: ViewProfileInterface) => {
  return (
    <div>
      <div id="cover-photo" className="uk-text-right">
        <span id="header-icon" data-uk-icon="ban" />
        <span id="header-icon" data-uk-icon="mail" />
        <span id="header-icon" data-uk-icon="plus" />
      </div>
      <div id="profile-header" className="uk-width-1-1">
        <div id="profile-header-picture">
          {profile.avatarHashes.medium ? (
            <img
              src={`${config.openBazaarHost}/ob/images/${
                profile.avatarHashes ? profile.avatarHashes.medium : ''
              }`}
            />
          ) : (
            <div uk-spinner="ratio: 3" />
          )}
        </div>
        <div id="profile-header-tab">
          <div id="profile-header-name">
            <h3>{profile.name}</h3>
          </div>
          <ul data-uk-tab="connect: #container-profile">
            <li className="uk-active">
              <a href="#" id="tab-label">
                Profile
              </a>
            </li>
            <li>
              <a href="#" id="tab-label">
                Store <span id="label-number"> {profile.stats!.listingCount} </span>
              </a>
            </li>
            <li>
              <a href="#" id="tab-label">
                Followers <span id="label-number"> {profile.stats!.followerCount} </span>
              </a>
            </li>
            <li>
              <a href="#" id="tab-label">
                Following <span id="label-number"> {profile.stats!.followingCount} </span>
              </a>
            </li>
            {isOwner ? (
              <>
                <li>
                  <a
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
      </div>
    </div>
  )
}

export default ProfileHeader
