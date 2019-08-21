import React from 'react'

import { ListingCardGroup } from '../CardGroup'
import { ProfileBasicInfoSegment } from '../Segment'

import Listing from '../../models/Listing'
import Profile from '../../models/Profile'

interface Props {
  profile: Profile
  listings: Listing[]
}

const ProfileSwitcher = ({ profile, listings }: Props) => (
  <ul id="container-profile" className="uk-switcher">
    <li>
      <ProfileBasicInfoSegment profile={profile} />
    </li>
    <li>
      <ListingCardGroup data={listings} />
    </li>
    <li>Coming soon!</li>
    <li>Coming soon!</li>
    <li>Redirecting...</li>
    <li>Redirecting...</li>
  </ul>
)

export default ProfileSwitcher
