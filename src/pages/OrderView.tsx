import React from 'react'

import { SideMenuWithContentCard } from '../components/Card'
import NavigationCard from '../components/Card/Order/NavigationCard'
import OrderSummaryCard from '../components/Card/Order/OrderSummaryCard'
import SellerInformationCard from '../components/Card/Order/SellerInformationCard'

class OrderView extends React.Component {
  public render() {
    return (
      <div className="uk-padding-small full-vh background-body">
        <SideMenuWithContentCard
          mainContentTitle="SUMMARY"
          menuContent={{
            title: 'PURCHASE HISTORY',
            navItems: [
              {
                label: 'Summary',
              },
              {
                label: 'Discussion',
              },
              {
                label: 'Contact',
              },
            ],
          }}
          mainContent={<OrderSummaryCard />}
        />
        {/* <div className="uk-card uk-card-default uk-card-body uk-width-5-6@m uk-flex uk-margin-auto">
          <div className="uk-flex uk-flex-row uk-margin">
            <div className="uk-flex uk-flex-column">
              <SellerInformationCard />
              <NavigationCard />
            </div>
            <div className="uk-margin-left uk-width-expand uk-margin-right">
              <OrderSummaryCard />
            </div>
          </div>
        </div> */}
      </div>
    )
  }
}

export default OrderView
