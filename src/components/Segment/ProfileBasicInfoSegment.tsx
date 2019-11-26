import React from 'react'
import ReactMarkdown from 'react-markdown'

import {
  CompetencyCard,
  OtherInformationCard,
  ProfessionalBackgroundCard,
  SocialMediaCard,
  TagsCard,
} from '../Card'

import { AssessmentSummary } from '../../models/CompetencySelector'
import Profile from '../../models/Profile'
import decodeHtml from '../../utils/Unescape'

import { localeInstance } from '../../i18n'

import './ProfileBasicInfoSegment.css'

interface Props {
  profile: Profile
}

const ProfileBasicInfoSegment = ({ profile }: Props) => {
  const { profilePage } = localeInstance.get.localizations

  return (
    <div>
      <div className="uk-card uk-card-default uk-card-body uk-margin-bottom">
        <h3 id="title-about" className="uk-card-title">
          {profilePage.aboutHeader}
        </h3>
        <div className="markdown-container">
          <ReactMarkdown source={profile.about} />
        </div>
      </div>
      <SocialMediaCard title={profilePage.socialMediaHeader} contact={profile.contactInfo} />
      {profile.background && profile.background.educationHistory.length > 0 ? (
        <ProfessionalBackgroundCard data={profile.background} name={profilePage.educationHeader} />
      ) : null}
      {profile.background && profile.background.employmentHistory.length > 1 ? (
        <ProfessionalBackgroundCard
          data={profile.background}
          name={profilePage.workHistoryHeader}
        />
      ) : null}
      <OtherInformationCard data={profile} />
      {JSON.parse(decodeHtml(profile.customProps.skills)).length > 1 ? (
        <TagsCard
          name={profilePage.skillsHeader}
          data={JSON.parse(decodeHtml(profile.customProps.skills))}
        />
      ) : null}
      <CompetencyCard data={profile.customProps.competencies as AssessmentSummary} />
    </div>
  )
}

export default ProfileBasicInfoSegment
