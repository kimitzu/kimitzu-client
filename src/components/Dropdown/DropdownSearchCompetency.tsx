import React from 'react'

import { CompetencySelectorInterface } from '../../models/CompetencySelector'
import './DropdownSearchCompetency.css'

interface DropdownSearchCompetencyProps {
  competencies: CompetencySelectorInterface[]
  checker: (id: string) => void
  searchChange: (q: string) => void
  searchResults: CompetencySelectorInterface[]
  val: string
}

const DropdownSearchCompetency = ({
  competencies,
  checker,
  searchChange,
  searchResults,
  val,
}: DropdownSearchCompetencyProps) => {
  return (
    <div id="main-cont-comp">
      <div
        id="flexible-cont-comp"
        className={searchResults.length !== 0 && val !== '' ? 'uk-box-shadow-large' : ''}
      >
        <div className="padding-fix">
          <div
            id="input-cont-comp"
            className={searchResults.length !== 0 && val !== '' ? 'bordered' : ''}
          >
            <input
              id="search-bar-comp"
              type="text"
              value={val}
              onChange={e => searchChange(e.target.value)}
            />
            <span data-uk-icon="icon: search; ratio: 1.2" className="color-primary" />
          </div>
        </div>
        {searchResults.length !== 0 && val !== '' ? (
          <ul id="search-comp-ul">
            {searchResults.map((cmp, i) => (
              <li key={`${cmp.id}-dsc`} onClick={() => checker(cmp.id)}>
                {cmp.title}
                <span data-uk-icon="icon: plus" className="color-primary" />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

export default DropdownSearchCompetency
