import React from 'react'
import './RoundSelector.css'

interface Props {
  handleSelect: (compIndex: number, matrixIndex: number, subIndex: string, index: number) => void
  id: string
  compIndex: number
  matrixIndex: number
  competency: any
}

const RoundSelector = ({ handleSelect, id, compIndex, matrixIndex, competency }: Props) => {
  return (
    <div className="main-round-selector">
      {competency.competencies[compIndex].matrix[matrixIndex].subCategories.map((sub, subIndex) => (
        <>
          <p className="title-round-selector">{sub.item}</p>
          <ul className="ul-round-selector">
            {sub.questions.map((q, index) => (
              <>
                <li key={`choices${index}`}>
                  <div
                    onClick={() => handleSelect(compIndex, matrixIndex, subIndex, index)}
                    className={`round-selector ${
                      sub.assessment === index ? 'round-selector-active' : ''
                    }`}
                    data-uk-tooltip={q}
                  >
                    {index}
                  </div>
                </li>
                {index !== 3 ? (
                  <li>
                    <div className="round-selector-bar" />
                  </li>
                ) : null}
              </>
            ))}
            {/* <li>
              <div
                onClick={() => handleSelect(title, key, 0)}
                className={`round-selector ${sub.assessment === 0 ? 'round-selector-active' : ''}`}
                data-uk-tooltip={sub.quusetions}
              >
                0
              </div>
            </li> */}
          </ul>
        </>
      ))}
    </div>
  )
}

export default RoundSelector
