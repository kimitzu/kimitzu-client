import React from 'react'

import { AssessmentSummary, competencySelectorInstance } from '../../models/CompetencySelector'
import AccordianTable from '../Accordion/AccordionTable'

import { localeInstance } from '../../i18n'

import './CompetencyCard.css'

interface CompetencyCardProps {
  data: AssessmentSummary
  singleCompetency?: string
}

const CompetencyCard = (props: CompetencyCardProps) => {
  const { data, singleCompetency } = props
  if (!data) {
    return null
  }

  const keys = Object.keys(data)
  const { profilePage } = localeInstance.get.localizations

  return (
    <div className="uk-margin-bottom">
      <div className="uk-card uk-card-default uk-card-body">
        <h3 id="title-background" className="uk-card-title">
          {profilePage.competencyHeader}
        </h3>
        <br />
        {keys.map(competencyKey => {
          if (singleCompetency && competencyKey !== singleCompetency) {
            return null
          }
          const competency = data[competencyKey]
          const assessment = competencySelectorInstance.generateFullAssessment(
            competencyKey,
            competency
          )
          return Object.keys(assessment).map(assessmentKey => {
            return (
              <React.Fragment key={assessmentKey}>
                <h4>{assessment[assessmentKey].title}</h4>
                <AccordianTable data={assessment[assessmentKey].assessment} />
              </React.Fragment>
            )
          })
        })}
      </div>
    </div>
  )
}

export default CompetencyCard
