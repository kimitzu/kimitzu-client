import React from 'react'
import NavigationCard from '../components/Card/Order/NavigationCard'
import OrderSummaryCard from '../components/Card/Order/OrderSummaryCard'
import SellerInformationCard from '../components/Card/Order/SellerInformationCard'

class OrderView extends React.Component {
  public render() {
    return (
      <div className="uk-flex uk-flex-row uk-margin">
        <div className="uk-flex uk-flex-column">
          <SellerInformationCard />
          <NavigationCard />
        </div>
        <div className="uk-margin-left uk-width-expand uk-margin-right">
          <OrderSummaryCard />
        </div>
      </div>
    )
  }
}

export default OrderView
