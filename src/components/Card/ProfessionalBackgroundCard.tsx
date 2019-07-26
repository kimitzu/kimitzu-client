import React from 'react'

import './ProfessionalBackgroundCard.css'

import { Background } from '../../interfaces/Profile'
import EducationCard from './Settings/EducationCard'
import EmploymentCard from './Settings/EmploymentCard'

interface ProfessionalBackgoundInterface {
  data: Background
  name: string
}

const ProfessionalBackgroundCard = (props: ProfessionalBackgoundInterface) => {
  const { data, name } = props
  let background

  if (name === 'Education') {
    background = data.educationHistory.map((history, index) => {
      return (
        <div key={index} className="uk-margin-top">
          <EducationCard history={history} />
        </div>
      )
    })
  } else {
    background = data.employmentHistory.map((history, index) => {
      return (
        <div key={index} className="uk-margin-top">
          <EmploymentCard history={history} />
        </div>
      )
    })
  }

  return (
    <div className="uk-margin-top">
      <div className="uk-card uk-card-default uk-card-body">
        <h3 id="title-background" className="uk-card-title">
          {name}
        </h3>
        {background}
      </div>
    </div>
  )
}

export default ProfessionalBackgroundCard
