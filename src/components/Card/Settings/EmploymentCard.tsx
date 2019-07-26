import React from 'react'

import './Settings.css'

import { EmploymentHistory } from '../../../interfaces/Profile'
import './EducationCard.css'

interface EmploymentCardProps {
  history: EmploymentHistory
}

const EmploymentCard = ({ history }: EmploymentCardProps) => {
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  let from
  let to

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
      <h4>{history.company}</h4>
      <p className="body-text-default uk-text-bold">{history.position}</p>
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
      <p className="body-text-default">{history.description}</p>
    </div>
  )
}

export default EmploymentCard
