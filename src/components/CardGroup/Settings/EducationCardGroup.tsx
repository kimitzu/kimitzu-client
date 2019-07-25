import React from 'react'
import Profile from '../../../models/Profile'
import AddEntryCard from '../../Card/Settings/AddEntryCard'
import EducationCard from '../../Card/Settings/EducationCard'

import './Settings.css'

interface EducationCardGroupProps {
  handleAddBtn: () => void
  handleSelectEducation: (educationIndex: number) => void
  profile: Profile
}

const EducationCardGroup = ({
  handleAddBtn,
  handleSelectEducation,
  profile,
}: EducationCardGroupProps) => {
  return (
    <div className="uk-flex-1 uk-width-1-1">
      {profile.background!.educationHistory.map((history, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              handleSelectEducation(index)
            }}
            className="uk-card uk-card-default uk-card-body uk-card-small uk-margin-bottom cursor-pointer"
          >
            <EducationCard history={history} />
          </div>
        )
      })}
      <AddEntryCard handleAddBtn={handleAddBtn} />
    </div>
  )
}

export default EducationCardGroup
