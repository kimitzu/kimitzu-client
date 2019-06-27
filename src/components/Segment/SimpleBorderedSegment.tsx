import React from 'react'

import './SimpleBorderedSegment.css'

interface Props {
  children: JSX.Element | JSX.Element[]
  imageSrc?: string
  icon?: string
  title?: string
  sideButtons?: JSX.Element | JSX.Element[] | null
}

const SimpleBorderedSegment = ({ children, icon, imageSrc, sideButtons, title }: Props) => (
  <div
    className="default-border uk-flex uk-flex-row uk-flex-middle uk-width-1-1"
    id="simple-bordered-segment"
  >
    {imageSrc ? <img className="uk-border-circle" width="40" height="40" src={imageSrc} /> : null}
    {icon ? <span className="color-primary uk-flex" uk-icon={`icon: ${icon}; ratio: 2`} /> : null}
    <div className="uk-flex uk-flex-middle uk-width-1-1">
      <div
        id="simple-bordered-segment-content"
        className={imageSrc || icon ? 'uk-margin-small-left uk-width-1-1' : 'uk-width-1-1'}
      >
        {title ? <h5 className="uk-text-bold">{title}</h5> : null}
        {children}
      </div>
      {sideButtons || null}
    </div>
  </div>
)

export default SimpleBorderedSegment
