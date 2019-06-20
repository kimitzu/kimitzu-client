import React, { useState } from 'react'

import './TermsOfServiceCard.css'

interface TermsOfServiceCardInterface {
  data: string
}

const TermsOfServiceCard = (props: TermsOfServiceCardInterface) => {
  const [classToggle, setclassToggle] = useState('moreContainer')
  const [hide, setHide] = useState(false)
  const { data } = props
  function animate() {
    // TODO: Convert selectors to Refs to conform to React Best Practices
    const el = document.getElementById('terms-content')
    const elAnim = document.getElementById('containerAnim')
    if (el && elAnim) {
      const height = el.clientHeight + 100
      elAnim.setAttribute('style', `height: ${height}px`)
      setclassToggle('moreContainerTwo')
      setHide(true)
    }
  }
  return (
    <div id="listing-main">
      <div id="containerAnim" className="uk-card uk-card-default uk-card-body animCont">
        <h3 id="title-terms" className="uk-card-title">
          Terms of Service
        </h3>
        <div id="terms-content">{data}</div>
        <div className={classToggle}>
          <h5 className="uk-text-bold moreBtn" onClick={() => animate()} hidden={hide}>
            Show more..
          </h5>
        </div>
      </div>
    </div>
  )
}

export default TermsOfServiceCard
