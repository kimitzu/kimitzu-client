import React from 'react'

import { Button } from '../../Button'
import DisputePayoutSegment from '../DisputePayoutSegment'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderDisputeDecided = ({ locale, order, handleOrderFundRelease, isSendingRequest }) => (
  <div className="uk-margin-bottom">
    <OrderSummaryItemSegment
      title={locale.orderViewPage.disputePayoutHeader}
      date={new Date(order.contract.disputeResolution!.timestamp)}
    >
      <SimpleBorderedSegment
        sideButtons={
          order.step === 9 ? (
            <div className="uk-flex uk-flex-row uk-flex-middle uk-flex-around">
              <Button
                className="uk-button uk-button-primary uk-margin-small-left max-content-width button-small-padding"
                onClick={handleOrderFundRelease}
                showSpinner={isSendingRequest}
              >
                {locale.orderViewPage.releaseFundBtnText}
              </Button>
            </div>
          ) : null
        }
      >
        <div className="uk-flex uk-flex-column">
          <DisputePayoutSegment
            name={order.vendor!.name}
            avatar={order.vendor!.avatarHashes.medium}
            amount={order.parseCrypto(
              order.contract.disputeResolution!.payout.vendorOutput
                ? order.contract.disputeResolution!.payout.vendorOutput.amount
                : 0
            )}
          />
          <DisputePayoutSegment
            name={order.buyer!.name}
            avatar={order.buyer!.avatarHashes.medium}
            amount={order.parseCrypto(
              order.contract.disputeResolution!.payout.buyerOutput
                ? order.contract.disputeResolution!.payout.buyerOutput.amount
                : 0
            )}
          />
          <DisputePayoutSegment
            name={order.moderator!.name}
            avatar={order.moderator!.avatarHashes.medium}
            amount={order.parseCrypto(
              order.contract.disputeResolution!.payout.moderatorOutput
                ? order.contract.disputeResolution!.payout.moderatorOutput.amount
                : 0
            )}
            note={order.contract.disputeResolution!.resolution}
          />
        </div>
      </SimpleBorderedSegment>
    </OrderSummaryItemSegment>
  </div>
)

export default OrderDisputeDecided
