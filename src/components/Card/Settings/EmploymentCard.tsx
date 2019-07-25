import React from 'react'

import './Settings.css'

import { EmploymentHistory } from '../../../interfaces/Profile'
import './EducationCard.css'

interface EmploymentCardProps {
  history: EmploymentHistory
}

const EmploymentCard = ({ history }: EmploymentCardProps) => {
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }

  return (
    <div>
      <h4>{history.company}</h4>
      <p className="body-text-default uk-text-bold">{history.position}</p>
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

export default EmploymentCard
