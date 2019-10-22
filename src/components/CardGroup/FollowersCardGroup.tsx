import React, { useEffect, useState } from 'react'

import { FollowerCard } from '../Card'
import { DottedSpinner } from '../Spinner'

import Profile from '../../models/Profile'

import { useInfiniteScroll } from '../../utils/react-hooks'

interface Props {
  peerIDs: Array<Profile['peerID']>
  isFollowingList?: boolean
}

interface FollowerProfile extends Profile {
  isFollowing: boolean
}

const PROFILE_LIMIT = 8

const FollowersCardGroup = ({ peerIDs, isFollowingList }: Props) => {
  const [profiles, setProfiles] = useState<FollowerProfile[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const loadMoreProfiles = async () => {
    if (profiles.length >= peerIDs.length) {
      setIsFetching(false)
      return
    }
    const nextPeerIDs = peerIDs.slice(
      currentPage * PROFILE_LIMIT,
      (currentPage + 1) * PROFILE_LIMIT
    )
    const nextProfiles = await Promise.all(
      nextPeerIDs.map(async peerID => {
        try {
          const profile = await Profile.retrieve(peerID)
          const isFollowing = isFollowingList || (await Profile.isFollowing(peerID))
          return Object.assign(profile, { isFollowing })
        } catch (error) {
          return Object.assign(new Profile(), { isFollowing: false })
        }
      })
    )
    setProfiles([...profiles, ...nextProfiles])
    setCurrentPage(currentPage + 1)
    setIsFetching(false)
  }
  const handleFollow = async (profile: FollowerProfile) => {
    const { peerID, isFollowing } = profile
    try {
      if (isFollowing) {
        await Profile.unfollow(peerID)
      } else {
        await Profile.follow(peerID)
      }
      setProfiles(prevState => {
        const profileIndex = prevState.findIndex(userProfile => userProfile.peerID === peerID)
        if (profileIndex > -1) {
          prevState[profileIndex].isFollowing = !isFollowing
        }
        return [...prevState]
      })
    } catch (error) {
      window.UIkit.notification(
        `${error.message}. Please try again later or make sure that the Djali server is running.`,
        {
          status: 'danger',
        }
      )
    }
  }
  const [isFetching, setIsFetching] = useInfiniteScroll(loadMoreProfiles)
  useEffect(() => {
    loadMoreProfiles()
  }, [])
  return (
    <div>
      <div className="uk-grid-small" data-uk-grid>
        {profiles.map((profile, index) => {
          if (!profile.peerID) {
            return null
          }
          return (
            <div key={`${profile.peerID}${index}`}>
              <FollowerCard profile={profile} handleFollowBtn={handleFollow} />
            </div>
          )
        })}
      </div>
      {isFetching ? <DottedSpinner /> : null}
    </div>
  )
}

export default FollowersCardGroup
