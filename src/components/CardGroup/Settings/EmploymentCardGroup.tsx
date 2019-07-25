import React from 'react'
import Profile from '../../../models/Profile'
import AddEntryCard from '../../Card/Settings/AddEntryCard'

import EmploymentCard from '../../Card/Settings/EmploymentCard'
import './Settings.css'

interface EmploymentCardGroup {
  handleAddBtn: () => void
  handleSelectEmployment: (educationIndex: number) => void
  profile: Profile
}

const EmploymentCardGroup = ({
  handleAddBtn,
  handleSelectEmployment,
  profile,
}: EmploymentCardGroup) => {
  return (
    <div className="uk-flex-1 uk-width-1-1">
      {profile.background!.employmentHistory.map((history, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              handleSelectEmployment(index)
            }}
            className="uk-card uk-card-default uk-card-body uk-card-small uk-margin-bottom cursor-pointer"
          >
            <EmploymentCard history={history} />
          </div>
        )
      })}
      <AddEntryCard handleAddBtn={handleAddBtn} />
    </div>
  )
}

export default EmploymentCardGroup
