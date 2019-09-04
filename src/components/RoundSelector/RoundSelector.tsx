import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import Skills from '../../constants/Skills.json'
import './RoundSelector.css'

interface Props {
  handleSelect: (title: string, key: string, index: number) => void
  title: string
  choices: string[]
  competency: any
}

const RoundSelector = ({ handleSelect, title, choices, competency, ...props }: Props) => {
  return (
    <div className="main-round-selector">
      {choices.map((key, index) => (
        <>
          <p className="title-round-selector">{key}</p>
          <ul className="ul-round-selector">
            <li>
              <div
                onClick={() => handleSelect(title, key, 0)}
                className={`round-selector ${
                  competency[title][key] === 0 ? 'round-selector-active' : ''
                }`}
                data-uk-tooltip={Skills[title][key][0]}
              >
                0
              </div>
            </li>
            <li>
              <div className="round-selector-bar" />
            </li>
            <li>
              <div
                onClick={() => handleSelect(title, key, 1)}
                className={`round-selector ${
                  competency[title][key] === 1 ? 'round-selector-active' : ''
                }`}
                data-uk-tooltip={Skills[title][key][1]}
              >
                1
              </div>
            </li>
            <li>
              <div className="round-selector-bar" />
            </li>
            <li>
              <div
                onClick={() => handleSelect(title, key, 2)}
                className={`round-selector ${
                  competency[title][key] === 2 ? 'round-selector-active' : ''
                }`}
                data-uk-tooltip={Skills[title][key][2]}
              >
                2
              </div>
            </li>
            <li>
              <div className="round-selector-bar" />
            </li>
            <li>
              <div
                onClick={() => handleSelect(title, key, 3)}
                className={`round-selector ${
                  competency[title][key] === 3 ? 'round-selector-active' : ''
                }`}
                data-uk-tooltip={Skills[title][key][3]}
              >
                3
              </div>
            </li>
          </ul>
        </>
      ))}
    </div>
  )
}

export default RoundSelector
