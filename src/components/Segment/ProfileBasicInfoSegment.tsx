import React from 'react'
import ReactMarkdown from 'react-markdown'
import Profile from '../../models/Profile'
import decodeHtml from '../../utils/Unescape'
import CompetencyCard from '../Card/CompetencyCard'
import OtherInformationCard from '../Card/OtherInformationCard'
import ProfessionalBackgroundCard from '../Card/ProfessionalBackgroundCard'
import SocialMediaCard from '../Card/SocialMediaCard'
import TagsCard from '../Card/TagsCard'

import { AssessmentSummary } from '../../models/CompetencySelector'
import './ProfileBasicInfoSegment.css'

interface Props {
  profile: Profile
}

const ProfileBasicInfoSegment = ({ profile }: Props) => (
  <div>
    <div className="uk-card uk-card-default uk-card-body uk-margin-bottom">
      <h3 id="title-about" className="uk-card-title">
        About
      </h3>
      <div className="markdown-container">
        <ReactMarkdown source={profile.about} />
      </div>
    </div>
    <SocialMediaCard contact={profile.contactInfo} />
    {profile.background && profile.background.educationHistory.length > 0 ? (
      <ProfessionalBackgroundCard data={profile.background} name="Education" />
    ) : null}
    {profile.background && profile.background.employmentHistory.length > 1 ? (
      <ProfessionalBackgroundCard data={profile.background} name="Work History" />
    ) : null}
    <OtherInformationCard data={profile} />
    {JSON.parse(decodeHtml(profile.customProps.skills)).length > 1 ? (
      <TagsCard name="Skills" data={JSON.parse(decodeHtml(profile.customProps.skills))} />
    ) : null}
    <CompetencyCard data={profile.customProps.competencies as AssessmentSummary} />
  </div>
)

export default ProfileBasicInfoSegment
