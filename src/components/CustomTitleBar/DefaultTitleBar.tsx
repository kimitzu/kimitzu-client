import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import './DefaultTitleBar.css'

interface Props {
  minimize: () => void
  maximize: () => void
  close: () => void
}

const DefaultTitleBar = ({ minimize, maximize, close }: Props) => {
  return (
    <div id="title-cont">
      <div id="control-cont">
        <span className="icon-arrows" data-uk-icon="icon: chevron-left; ratio: 1.5" />
        <span className="icon-arrows" data-uk-icon="icon: chevron-right; ratio: 1.5" />
        <span className="icon-ref" data-uk-icon="icon: refresh; ratio: 1.2" />
      </div>
      <div id="url-cont">
        <input id="url-input" onChange={() => alert('to do')} />
      </div>
      <div id="buttons-cont">
        <span id="min" data-uk-icon="icon: minus; ratio: 1.3" onClick={minimize} />
        <div id="max" onClick={maximize}>
          Max
        </div>
        <span id="close" data-uk-icon="icon: close; ratio: 1.3" onClick={close} />
      </div>
    </div>
  )
}

export default DefaultTitleBar
