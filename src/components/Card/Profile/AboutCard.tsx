import React from 'react'
import Profile from '../../../models/Profile'
import OtherInformationCard from '../OtherInformationCard'
import ProfessionalBackgroundCard from '../ProfessionalBackgroundCard'
import SocialMediaCard from '../SocialMediaCard'

interface ViewProfileInterface {
  data: Profile
}

const AboutCard = (props: ViewProfileInterface) => {
  return (
    <div>
      <div>
        <div className="uk-card uk-card-default uk-card-body">
          <h3 id="title-about" className="uk-card-title">
            About
          </h3>
          <p>{props.data.about}</p>
        </div>
      </div>
      <SocialMediaCard />
      {props.data.background && props.data.background.educationHistory ? (
        <ProfessionalBackgroundCard data={props.data.background} name="Education" />
      ) : null}
      {props.data.background && props.data.background.employmentHistory ? (
        <ProfessionalBackgroundCard data={props.data.background} name="Work History" />
      ) : null}
      <OtherInformationCard data={props.data} />
    </div>
  )
}

export default AboutCard
