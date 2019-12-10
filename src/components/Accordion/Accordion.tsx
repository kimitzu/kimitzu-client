import React from 'react'
import './Accordion.css'

interface Content {
  title: string
  component: JSX.Element
}

interface Props {
  content: Content[]
}

const Accordion = ({ content }: Props) => {
  return (
    <div id="main-div-acc">
      <ul id="accordion-main" data-uk-accordion>
        {content.map((cont, index) => (
          <li key={`acc${index}`}>
            <a
              className="uk-accordion-title uk-button uk-button-link"
              href="/#"
              onClick={evt => evt.preventDefault()}
            >
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
