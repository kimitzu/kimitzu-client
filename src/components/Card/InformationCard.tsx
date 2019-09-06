import React from 'react'

interface Props {
  title: string
  subHeader?: JSX.Element | JSX.Element[]
  children?: JSX.Element | JSX.Element[]
}

const InformationCard = ({ title, subHeader, children }: Props) => (
  <div className="uk-card uk-card-default uk-card-body">
    <h3 className="uk-text-bold">{title}</h3>
    <div>{subHeader}</div>
    <div className="uk-margin-small-top">{children}</div>
  </div>
)

export default InformationCard
