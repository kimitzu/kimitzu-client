import React from 'react'

import { Localizations } from '../../../i18n/LocalizationsInterface'
import { Button } from '../../Button'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

interface OrderConfirmOfflineInterface {
  locale: Localizations
  onConfirmOfflineOrder: (confirm: boolean) => void
}

const OrderConfirmOffline = ({ locale, onConfirmOfflineOrder }: OrderConfirmOfflineInterface) => (
  <div className="uk-margin-bottom">
    <OrderSummaryItemSegment title={`Offline Order`}>
      <SimpleBorderedSegment>
        <div className="uk-flex uk-flex-column uk-text-center">
          <p>{locale.orderConfirmOffline.message}</p>
          <div className="uk-flex uk-flex-row uk-flex-center uk-margin-top uk-margin-bottom">
            <Button
              className="uk-button uk-button-primary uk-margin-right"
              onClick={() => {
                onConfirmOfflineOrder(true)
              }}
            >
              {locale.orderConfirmOffline.acceptOrder}
            </Button>
            <Button
              className="uk-button uk-button-danger"
              onClick={() => {
                onConfirmOfflineOrder(false)
              }}
            >
              {locale.orderConfirmOffline.rejectOrder}
            </Button>
          </div>
        </div>
      </SimpleBorderedSegment>
    </OrderSummaryItemSegment>
  </div>
)

export default OrderConfirmOffline
