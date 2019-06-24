import React from 'react'

interface Props {
  title: string
  info: string
  icon?: string
  children?: JSX.Element | JSX.Element[]
}

const InfoGroupBlock = (props: Props) => (
  <div className="uk-margin">
    <div className="uk-flex uk-flex-row uk-flex-middle">
      {props.icon ? <div className="uk-margin-right">{props.icon}</div> : null}
      <div className="uk-flex uk-flex-column">
        <div className="uk-text-primary uk-text-bold">{props.title}</div>
        <div className="uk-text-muted">{props.info}</div>
      </div>
      {props.children ? <hr className="uk-divider-vertical" /> : null}
      <div className="uk-margin-left">{props.children}</div>
    </div>
  </div>
)

export default InfoGroupBlock
