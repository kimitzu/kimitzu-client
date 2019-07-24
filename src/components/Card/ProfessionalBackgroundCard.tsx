import React from 'react'

import './ProfessionalBackgroundCard.css'

import { Background, EducationHistory } from '../../interfaces/Profile'
import EducationCard from './Settings/EducationCard'

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
    background = data.employmentHistory.map((d, i) => {
      return (
        <div key={`bgid${i}`}>
          <div id="background-history">
            <p>
              <b> {d.title} </b>
            </p>
            <p>{d.subtitle}</p>
            <p>{d.date}</p>
            <p>{d.address}</p>
            <p>{d.desc}</p>
          </div>
          <hr />
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
