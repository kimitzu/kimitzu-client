import React from 'react'
import FlipMove from 'react-flip-move'

import { CompetencySelectorInterface } from '../../../models/CompetencySelector'
import './CompetencySelector.css'

interface CompetencySelectorProps {
  competencies: CompetencySelectorInterface[]
  checker: (id: number) => void
  showTest: (index: number, id: string) => void
}

const CompetencySelector = ({ competencies, checker, showTest }: CompetencySelectorProps) => {
  return (
    <div id="competency-selector">
      <FlipMove
        className="competency-selector-ul"
        typeName="ul"
        leaveAnimation={'none'}
        enterAnimation={'elevator'}
      >
        {competencies.map((cmp, i) => {
          return (
            <li key={cmp.id}>
              {cmp.title}
              <div className="competency-selector-actions">
                <span
                  data-uk-icon="icon: cog; ratio: 1.2"
                  className="blue-icon"
                  onClick={() => showTest(i, cmp.id)}
                />
                <input
                  key={`${cmp.id}-${cmp.checked}`}
                  className="uk-checkbox fix-margin"
                  type="checkbox"
                  checked={cmp.checked}
                  onClick={() => checker(i)}
                />
              </div>
            </li>
          )
        })}
      </FlipMove>
    </div>
  )
}

export default CompetencySelector
