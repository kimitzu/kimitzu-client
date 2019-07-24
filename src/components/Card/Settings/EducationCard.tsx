import React from 'react'

import { EducationHistory } from '../../../interfaces/Profile'
import './Settings.css'

import './EducationCard.css'

interface EducationCardProps {
  history: EducationHistory
}

const EducationCard = ({ history }: EducationCardProps) => {
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }

  return (
    <div>
      <h4>{history.institution}</h4>
      <p className="body-text-default uk-text-bold">{history.degree}</p>
      <p className="body-text-default">
        {history.period!.from.toLocaleDateString('default', dateOptions)} to{' '}
        {'to' in history.period!
          ? history.period!.to!.toLocaleDateString('default', dateOptions)
          : 'PRESENT'}
      </p>
      <p className="body-text-default">
        {history.location.city}, {history.location.country}
      </p>
      <p className="body-text-default">{history.description}</p>
    </div>
  )
}

export default EducationCard
