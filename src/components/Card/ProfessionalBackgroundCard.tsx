import React from 'react'

import './ProfessionalBackgroundCard.css'

import { Background, EducationHistory } from '../../interfaces/Profile'

interface ProfessionalBackgoundInterface {
  data: Background
  name: string
}

const ProfessionalBackgroundCard = (props: ProfessionalBackgoundInterface) => {
  const { data, name } = props
  let background
  if (name === 'Education') {
    background = data.educationHistory
  } else {
    background = data.employmentHistory
  }
  return (
    <div className="uk-margin-top">
      <div className="uk-card uk-card-default uk-card-body">
        <h3 id="title-background" className="uk-card-title">
          {name}
        </h3>
        {background.map((d, i) => (
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
            {background.length !== i + 1 ? <hr /> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfessionalBackgroundCard
