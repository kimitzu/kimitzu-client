import React from 'react'
import AccordianTable from '../../components/Accordion/AccordionTable'
import decodeHtml from '../../utils/Unescape'
import './ProgrammersCompetencyCard.css'

interface ProgrammersCompetencyCard {
  data: any
}

const ProgrammersCompetencyCard = (props: ProgrammersCompetencyCard) => {
  const { data } = props
  return (
    <div className="uk-margin-bottom">
      <div className="uk-card uk-card-default uk-card-body">
        <h3 id="title-background" className="uk-card-title">
          Programmer Competency
        </h3>
        <br />
        <AccordianTable data={JSON.parse(decodeHtml(data.customProps.programmerCompetency))} />
      </div>
    </div>
  )
}

export default ProgrammersCompetencyCard
