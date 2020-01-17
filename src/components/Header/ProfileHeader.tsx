import React from 'react'

import { Button } from '../Button'

import Profile from '../../models/Profile'

import config from '../../config'

import { localeInstance } from '../../i18n'

import './ProfileHeader.css'

interface ViewProfileInterface {
  profile: Profile
  isOwner: boolean
  handleFollowBtn: () => void
  handleBlockBtn: () => void
  handleMessageBtn: () => void
  isFollowing: boolean
  isBlocked: boolean
}

const ProfileHeader = ({
  profile,
  isOwner,
  isFollowing,
  isBlocked,
  handleMessageBtn,
  handleBlockBtn,
  handleFollowBtn,
}: ViewProfileInterface) => {
  const {
    profilePage,
    followButton,
    blockButton,
    profilePage: { tabTitles },
  } = localeInstance.get.localizations

  const navigateToSettings = () => {
    window.location.hash = '/settings'
  }

  return (
    <div>
      <div id="cover-photo" className="uk-text-right">
        <div hidden={isOwner} className="uk-button-group">
          <Button
            id="header-btn"
            className="uk-button uk-button-small button-hover-change-text"
            data-hover={isFollowing ? followButton.followingBtnTip : followButton.followBtnText}
            onClick={handleFollowBtn}
          >
            <span>{isFollowing ? followButton.followingBtnText : followButton.followBtnText}</span>
          </Button>
          <Button id="header-btn" className="uk-button uk-button-small" onClick={handleMessageBtn}>
            {profilePage.messageBtnText}
          </Button>
          <Button
            id="header-btn"
            className="uk-button uk-button-small button-hover-change-text"
            data-hover={isBlocked ? blockButton.blockedBtnTip : blockButton.blockBtnText}
            onClick={handleBlockBtn}
          >
            <span>{isBlocked ? blockButton.blockedBtnText : blockButton.blockBtnText}</span>
          </Button>
        </div>
        <div hidden={!isOwner} className="uk-button-group">
          <Button
            id="header-btn"
            className="uk-button uk-button-small"
            onClick={navigateToSettings}
          >
            <span>
              {localeInstance.get.localizations.listingPage.editBtnText}{' '}
              {localeInstance.get.localizations.navigationBar.profileLabel}
            </span>
          </Button>
        </div>
      </div>
      <div id="profile-header" className="uk-width-1-1 hidden-profile-options">
        <div id="profile-header-picture">
          {profile.peerID ? (
            <img
              src={
                profile.avatarHashes.medium
                  ? `${config.openBazaarHost}/ob/images/${profile.avatarHashes.medium}`
                  : `${config.host}/images/user.svg`
              }
              alt="Avatar"
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
              <a href="/#" id="desktop-profile-tab-label" onClick={evt => evt.preventDefault()}>
                {tabTitles.profile}
              </a>
            </li>
            <li>
              <a href="/#" id="desktop-store-tab-label" onClick={evt => evt.preventDefault()}>
                {tabTitles.store} <span id="label-number"> {profile.stats!.listingCount} </span>
              </a>
            </li>
            <li>
              <a href="/#" id="desktop-ratings-tab-label" onClick={evt => evt.preventDefault()}>
                {tabTitles.ratings}
              </a>
            </li>
            <li>
              <a href="/#" id="desktop-followers-tab-label" onClick={evt => evt.preventDefault()}>
                {tabTitles.followers}{' '}
                <span id="label-number"> {profile.stats!.followerCount} </span>
              </a>
            </li>
            <li>
              <a href="/#" id="desktop-following-tab-label" onClick={evt => evt.preventDefault()}>
                {tabTitles.following}{' '}
                <span id="label-number"> {profile.stats!.followingCount} </span>
              </a>
            </li>
            {isOwner ? (
              <>
                <li>
                  <a
                    href="/#"
                    id="desktop-sales-tab-label"
                    onClick={evt => {
                      evt.preventDefault()
                      window.location.hash = '/history/sales'
                    }}
                  >
                    {tabTitles.salesHistory}
                  </a>
                </li>
                <li>
                  <a
                    href="/#"
                    id="desktop-purchases-tab-label"
                    onClick={evt => {
                      evt.preventDefault()
                      window.location.hash = '/history/purchases'
                    }}
                  >
                    {tabTitles.purchaseHistory}
                  </a>
                </li>
              </>
            ) : null}
          </ul>
        </div>
      </div>
      <div id="profile-header" className="uk-width-1-1 hidden-profile-options-2">
        <div id="profile-header-picture">
          {profile.peerID ? (
            <img
              src={
                profile.avatarHashes.medium
                  ? `${config.openBazaarHost}/ob/images/${profile.avatarHashes.medium}`
                  : `${config.host}/images/user.svg`
              }
              alt="Avatar"
            />
          ) : (
            <div uk-spinner="ratio: 3" />
          )}
        </div>
        <div id="profile-header-name">
          <h3>{profile.name}</h3>
        </div>
        <div id="profile-header-tab">
          <ul data-uk-tab="connect: #container-profile">
            <li className="uk-active">
              <a href="/#" id="mobile-profile-tab-label" onClick={evt => evt.preventDefault()}>
                {tabTitles.profile}
              </a>
            </li>
            <li>
              <a href="/#" id="mobile-store-tab-label" onClick={evt => evt.preventDefault()}>
                {tabTitles.store} <span id="label-number"> {profile.stats!.listingCount} </span>
              </a>
            </li>
            <li>
              <a href="/#" id="mobile-ratings-tab-label" onClick={evt => evt.preventDefault()}>
                {tabTitles.ratings}
              </a>
            </li>
            <li>
              <a href="/#" id="mobile-followers-tab-label" onClick={evt => evt.preventDefault()}>
                {tabTitles.followers}{' '}
                <span id="label-number"> {profile.stats!.followerCount} </span>
              </a>
            </li>
            <li>
              <a href="/#" id="tab-label" onClick={evt => evt.preventDefault()}>
                <span data-uk-icon="triangle-down">MORE </span>
                <div data-uk-dropdown="pos: bottom-justify">
                  <ul className="uk-nav uk-dropdown-nav">
                    <li>
                      <a
                        href="/#"
                        id="mobile-following-tab-label"
                        onClick={evt => evt.preventDefault()}
                      >
                        {tabTitles.following}{' '}
                        <span id="label-number"> {profile.stats!.followingCount} </span>
                      </a>
                    </li>
                    {isOwner ? (
                      <>
                        <li>
                          <a
                            href="/#"
                            id="mobile-sales-tab-label"
                            onClick={evt => {
                              evt.preventDefault()
                              window.location.hash = '/history/sales'
                            }}
                          >
                            {tabTitles.salesHistory}
                          </a>
                        </li>
                        <li>
                          <a
                            href="/#"
                            id="mobile-purchases-tab-label"
                            onClick={evt => {
                              evt.preventDefault()
                              window.location.hash = '/history/purchases'
                            }}
                          >
                            {tabTitles.purchaseHistory}
                          </a>
                        </li>
                      </>
                    ) : null}
                  </ul>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
