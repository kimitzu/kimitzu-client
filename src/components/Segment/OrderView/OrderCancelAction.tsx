import React, { useState } from 'react'

import { Localizations } from '../../../i18n/LocalizationsInterface'
import Order from '../../../models/Order'
import { Button } from '../../Button'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

interface OrderCancelActionInterface {
  locale: Localizations
  order: Order
  handleCancelOrder: () => void
}

const OrderCancelAction = ({ locale, order, handleCancelOrder }: OrderCancelActionInterface) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="uk-margin-bottom">
      <OrderSummaryItemSegment title={locale.orderViewPage.cancelOrderHeader}>
        <SimpleBorderedSegment
          sideButtons={
            <Button
              className="uk-button uk-button-primary uk-margin-small-left max-content-width button-small-padding"
              showSpinner={isLoading}
              onClick={() => {
                window.UIkit.modal.confirm(locale.orderViewPage.cancelPromptParagraph).then(
                  async () => {
                    setIsLoading(true)
                    try {
                      await handleCancelOrder()
                      window.UIkit.notification(`${locale.orderViewPage.canceledOrderHeader}`, {
                        status: 'success',
                      })
                      setIsLoading(false)
                    } catch (e) {
                      window.UIkit.notification(e.message, {
                        status: 'success',
                      })
                      setIsLoading(false)
                    }
                  },
                  () => {
                    // Prompt canceled, do nothing.
                  }
                )
              }}
              id="cancel-order-button"
            >
              {locale.orderViewPage.cancelText}
            </Button>
          }
        >
          <p className="color-secondary">{locale.orderViewPage.cancelOrderActionParagraph}</p>
        </SimpleBorderedSegment>
      </OrderSummaryItemSegment>
    </div>
  )
}

export default OrderCancelAction
