import React, { useEffect, useState } from 'react'
import './Accordion.css'

interface Content {
  title: string
  component: JSX.Element
}

interface Props {
  content: Content[]
}

const Accordion = ({ content, ...props }: Props) => {
  return (
    <div id="main-div-acc">
      <ul id="accordion-main" data-uk-accordion>
        {content.map((cont, index) => (
          <li key={`acc${index}`}>
            <a className="uk-accordion-title" href="#">
              {cont.title}
            </a>
            <div className="uk-accordion-content">{cont.component}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Accordion
