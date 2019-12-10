import React from 'react'
import { FullAssessmentReport } from '../../models/CompetencySelector'
import './Accordion.css'

interface Props {
  data: FullAssessmentReport[]
}

const Accordion = ({ data, ...props }: Props) => {
  return (
    <div id="main-div-acc">
      <ul id="accordion-main" data-uk-accordion>
        {data.map((cont, index) => {
          const el = cont.subCategories.map((comp, i) => {
            return (
              <tr key={`trTable${i}`}>
                <td>{comp.item}</td>
                <td>{comp.assessment !== -1 ? comp.description : 'Unrated'}</td>
                <td>{comp.assessment}</td>
              </tr>
            )
          })
          return (
            <li key={`acclist${index}`}>
              <a
                className="uk-accordion-title small-font"
                href="/#"
                onClick={evt => evt.preventDefault()}
              >
                {cont.category}
              </a>
              <div className="uk-accordion-content uk-overflow-auto">
                <table className="uk-table uk-table-divider">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Assessment</th>
                    </tr>
                  </thead>
                  <tbody>{el}</tbody>
                </table>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Accordion
