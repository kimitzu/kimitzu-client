import moment from 'moment'
import React from 'react'

interface Props {
  title: string
  date?: Date
  children?: JSX.Element | JSX.Element[]
}

const OrderSummaryItemSegment = ({ children, date, title }: Props) => (
  <div className="uk-width-1-1">
    <div className="uk-flex uk-flex-row uk-margin-small-bottom">
      <h5 className="uk-text-bold">{title}</h5>
      {date ? (
        <h5 className="color-secondary uk-margin-left">
          {moment(new Date(date).toISOString()).format('MMMM DD, YYYY h:mm:ss a')}
        </h5>
      ) : null}
    </div>
    {children}
  </div>
)

export default OrderSummaryItemSegment
