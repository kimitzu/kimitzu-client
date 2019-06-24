import React from 'react'

interface Props {
  children: React.ReactNode
  status: string
  date: string
}

const ItemDetailCard = (props: Props) => (
  <div className="uk-width-1-1">
    <div>
      <span className="uk-text-primary uk-text-bold">{props.status}</span>
      <span className="uk-text-muted uk-margin-left">{props.date}</span>
    </div>
    <div className="uk-card uk-card-default uk-card-body">{props.children}</div>
  </div>
)

export default ItemDetailCard
