import React from 'react'

import { Button } from '../Button'

import Profile from '../../models/Profile'

import './FollowerCard.css'

interface FollowerProfile extends Profile {
  isFollowing: boolean
}
interface Props {
  profile: FollowerProfile
  handleFollowBtn: (profile: FollowerProfile) => void
}

const FollowerCard = ({ profile, handleFollowBtn }: Props) => {
  const { stats, name, isFollowing } = profile
  return (
    <div id="follower-card" className="uk-card uk-card-default uk-card-body">
      <div className="uk-flex uk-flex-center uk-flex-middle">
        <img
          id="follower-card-img"
          className="uk-border-pill"
          src={profile.getAvatarSrc('small')}
          alt="Follower Avatar"
        />
      </div>
      <div id="follower-card-details">
        <div id="follower-card-name">
          <h5 className="uk-text-truncate">{name}</h5>
        </div>
        {stats ? (
          <div id="follower-card-stats" className="uk-flex">
            <div className="uk-flex-1">
              <p className="uk-text-bold">{stats.listingCount}</p>
              <p id="follower-card-detail-label">Listings</p>
            </div>
            <div className="uk-flex-1">
              <p className="uk-text-bold">{stats.followingCount}</p>
              <p id="follower-card-detail-label">Following</p>
            </div>
            <div className="uk-flex-1">
              <p className="uk-text-bold">{stats.followerCount}</p>
              <p id="follower-card-detail-label">Followers</p>
            </div>
          </div>
        ) : null}
      </div>
      <div id="follower-card-btn-div-btn" className="uk-flex uk-flex-center uk-flex-middle">
        <Button
          id="follower-card-btn"
          className="uk-button uk-button-primary button-hover-change-text"
          data-hover={isFollowing ? 'Unfollow' : 'Follow'}
          onClick={() => handleFollowBtn(profile)}
        >
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        </Button>
      </div>
    </div>
  )
}

export default FollowerCard
