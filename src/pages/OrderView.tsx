import React from 'react'

import { SideMenuWithContentCard } from '../components/Card'
import NavigationCard from '../components/Card/Order/NavigationCard'
import OrderSummaryCard from '../components/Card/Order/OrderSummaryCard'
import SellerInformationCard from '../components/Card/Order/SellerInformationCard'
import {
  OrderDetailsSegment,
  OrderSummaryItemSegment,
  SimpleBorderedSegment,
} from '../components/Segment'

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
          mainContent={
            <div className="uk-width-1-1">
              <div className="uk-margin-bottom">
                <OrderSummaryItemSegment title="Fullfiled" date={new Date()}>
                  <SimpleBorderedSegment
                    title="Shadow Assassin"
                    imageSrc="https://vignette.wikia.nocookie.net/leagueoflegends/images/1/16/Kayn_OriginalCircle_Shadow_Assassin.png/revision/latest?cb=20171112101024"
                  >
                    <p className="color-secondary">Kill the body. Build the body. Free the body.</p>
                  </SimpleBorderedSegment>
                </OrderSummaryItemSegment>
              </div>
              <div className="uk-margin-bottom">
                <OrderSummaryItemSegment title="Accepted" date={new Date()}>
                  <SimpleBorderedSegment
                    title="Kayn"
                    imageSrc="https://www.mobafire.com/images/avatars/kayn-classic.png"
                  >
                    <p className="color-secondary">I have chosen you, you will serve me.</p>
                  </SimpleBorderedSegment>
                </OrderSummaryItemSegment>
              </div>
              <div className="uk-margin-bottom">
                <OrderSummaryItemSegment title="Payment Details" date={new Date()}>
                  <SimpleBorderedSegment title="$2.01 (0.00021124464 BTC) to Summoner" icon="check">
                    <p className="color-secondary">
                      0 confirmations. 0x12ead123...{' '}
                      <a className="text-underline uk-margin-small-left">Paid in Full</a>
                    </p>
                  </SimpleBorderedSegment>
                </OrderSummaryItemSegment>
              </div>
              <div className="uk-margin-bottom uk-width-1-1">
                <OrderSummaryItemSegment title="Order Details" date={new Date()}>
                  <SimpleBorderedSegment>
                    <OrderDetailsSegment
                      listingName="Smurf LOL"
                      listingThumbnailSrc="https://yt3.ggpht.com/DT7GmC5x6grz9ukAG3tSnSn7YxIC9sarCFH2qIWGDgbxuiPFnvJtzXAByAP4npBZqiuzVdYiAXffBxsgEg=s900-mo-c-c0xffffffff-rj-k-no"
                      listingType="SERVICE"
                      quantity="5 hrs"
                      total="$25.00 (0.000921314 BTC)"
                      memo="Use Kayn only because he is awesome."
                    />
                  </SimpleBorderedSegment>
                </OrderSummaryItemSegment>
              </div>
            </div>
          }
        />
      </div>
    )
  }
}

export default OrderView
