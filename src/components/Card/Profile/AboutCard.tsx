import React from 'react'
import Profile from '../../../models/Profile'
import OtherInformationCard from '../OtherInformationCard'
import ProfessionalBackgroundCard from '../ProfessionalBackgroundCard'
import SocialMediaCard from '../SocialMediaCard'

interface ViewProfileInterface {
  profile: Profile
}

const AboutCard = (props: ViewProfileInterface) => {
  return (
    <div>
      <div>
        <div className="uk-card uk-card-default uk-card-body">
          <h3 id="title-about" className="uk-card-title">
            About
          </h3>
          <p>{props.profile.about}</p>
        </div>
      </div>
      <SocialMediaCard socialMedia={props.profile.contactInfo.social} />
      {props.profile.background && props.profile.background.educationHistory ? (
        <ProfessionalBackgroundCard data={props.profile.background} name="Education" />
      ) : null}
      {props.profile.background && props.profile.background.employmentHistory ? (
        <ProfessionalBackgroundCard data={props.profile.background} name="Work History" />
      ) : null}
      <OtherInformationCard data={props.profile} />
    </div>
  )
}

export default AboutCard
