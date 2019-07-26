import React from 'react'

import { EducationHistory } from '../../../interfaces/Profile'
import './Settings.css'

import './EducationCard.css'

interface EducationCardProps {
  history: EducationHistory
}

const EducationCard = ({ history }: EducationCardProps) => {
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  let to
  let from

  if (history.period) {
    from = history.period.from.toLocaleDateString('default', dateOptions)
    if (history.period.to) {
      to = history.period.to.toLocaleDateString('default', dateOptions)
    } else {
      to = 'PRESENT'
    }
  }

  return (
    <div>
      <h4>{history.institution}</h4>
      <p className="body-text-default uk-text-bold">{history.degree}</p>
      {history.period ? (
        <p className="body-text-default">
          {from} to {to}
        </p>
      ) : null}
      {history.location ? (
        <p className="body-text-default">
          {history.location.city}, {history.location.country}
        </p>
      ) : null}
      <p className="body-text-default">{history.description || ''}</p>
    </div>
  )
}

export default EducationCard
