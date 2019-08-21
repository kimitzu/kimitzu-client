import React from 'react'
import Profile from '../../models/Profile'
import OtherInformationCard from '../Card/OtherInformationCard'
import ProfessionalBackgroundCard from '../Card/ProfessionalBackgroundCard'
import SocialMediaCard from '../Card/SocialMediaCard'

interface Props {
  profile: Profile
}

const ProfileBasicInfoSegment = ({ profile }: Props) => (
  <div>
    <div className="uk-card uk-card-default uk-card-body">
      <h3 id="title-about" className="uk-card-title">
        About
      </h3>
      <p>{profile.about}</p>
    </div>
    <SocialMediaCard contact={profile.contactInfo} />
    {profile.background && profile.background.educationHistory.length > 0 ? (
      <ProfessionalBackgroundCard data={profile.background} name="Education" />
    ) : null}
    {profile.background && profile.background.employmentHistory.length > 1 ? (
      <ProfessionalBackgroundCard data={profile.background} name="Work History" />
    ) : null}
    <OtherInformationCard data={profile} />
  </div>
)

export default ProfileBasicInfoSegment
