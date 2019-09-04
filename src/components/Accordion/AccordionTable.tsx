import React, { useEffect, useState } from 'react'
import Skills from '../../constants/Skills.json'
import './Accordion.css'

interface Props {
  data?: any
}

const Accordion = ({ data, ...props }: Props) => {
  return (
    <div id="main-div-acc">
      <ul id="accordion-main" data-uk-accordion>
        {Object.keys(data).map((cont, index) => (
          <li key={`acc${index}`}>
            <a className="uk-accordion-title" href="#">
              {cont}
            </a>
            <div className="uk-accordion-content">
              <table className="uk-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(data[cont]).map((c, i) => {
                    let level

                    if (data[cont][c] === -1) {
                      level = 'Unrated'
                    } else {
                      level = data[cont][c]
                    }

                    return (
                      <tr key={`tb${i}`}>
                        <td>{c}</td>
                        <td>{Skills[cont][c][level]}</td>
                        <td>{level}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Accordion
