import React from 'react'

import { Button } from '../../Button'
import InfoGroupBlock from './InfoGroupBlock'
import ItemDetailCard from './ItemDetailCard'

const OrderSummaryCard = props => (
  <div className="uk-card uk-card-default uk-card-body">
    <div className="uk-flex uk-flex-column">
      <div className="uk-text-lead uk-align-center">SUMMARY</div>
      <div>=== GRAPHIC STATUS PANE ===</div>
      <div className="uk-margin">
        <ItemDetailCard status={'Order Complete'} date={new Date().toLocaleString()}>
          <InfoGroupBlock
            icon={'check'}
            title={"Customer Name's Review"}
            info={'Very good seller'}
          />
        </ItemDetailCard>
      </div>
      <div className="uk-margin">
        <ItemDetailCard status={'Fulfilled'} date={new Date().toLocaleString()}>
          <InfoGroupBlock icon={'check'} title={'Your note'} info={'Very good customer'} />
        </ItemDetailCard>
      </div>
      <div className="uk-margin">
        <ItemDetailCard status={'Accepted'} date={new Date().toLocaleString()}>
          <InfoGroupBlock
            icon={'profile'}
            title={'Order Accepted'}
            info={'Thank you for your purchase'}
          >
            <Button className="uk-button uk-button-primary">Fulfill Order</Button>
          </InfoGroupBlock>
        </ItemDetailCard>
      </div>
      <div className="uk-margin">
        <ItemDetailCard status={'Payment Details'} date={new Date().toLocaleString()}>
          <InfoGroupBlock
            icon={'check'}
            title={'$2.01 to Seller Name'}
            info={'0 Confirmations   jasdfjsaoifasofuasdofiuasdofu'}
          />
        </ItemDetailCard>
      </div>
      <div className="uk-margin">
        <ItemDetailCard status={'Order Details'} date={new Date().toLocaleString()}>
          <div className="uk-flex uk-flex-row">
            <div>Image</div>
            <div className="uk-margin-left">
              <InfoGroupBlock title={'Service Name'} info={'Type: Service'} />
              <InfoGroupBlock title={'Requested Units'} info={'20 Hours'} />
              <InfoGroupBlock title={'Total'} info={'$2.01'} />
            </div>
          </div>
          <hr className="uk-margin" />
          <InfoGroupBlock title={'Memo'} info={'Lorem ipsum dolor sit amet'} />
        </ItemDetailCard>
      </div>
    </div>
  </div>
)

export default OrderSummaryCard
