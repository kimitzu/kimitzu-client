import React from 'react'

import { Link } from 'react-router-dom'
import config from '../../../config'
import { Button } from '../../Button'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderFulfillForm = ({ locale, order, handleChangeCurrentContent }) => {
  return (
    <div className="uk-margin-bottom">
      <OrderSummaryItemSegment
        title={locale.orderViewPage.orderAcceptedHeader}
        date={
          new Date(
            order.paymentAddressTransactions[order.paymentAddressTransactions.length - 1].timestamp
          )
        }
      >
        <SimpleBorderedSegment
          imageSrc={
            order.vendor!.avatarHashes.medium
              ? `${config.kimitzuHost}/kimitzu/media?id=${order.vendor!.avatarHashes.medium}`
              : `${process.env.PUBLIC_URL}/images/user.svg`
          }
          sideButtons={
            order.role === 'vendor' && order.step === 2 ? (
              <div className="uk-flex uk-flex-row uk-flex-middle uk-flex-around">
                <a href="#" className="margin-small-right text-underline" id="js-modal-prompt">
                  {locale.orderViewPage.refundLink}
                </a>
                <Button
                  className="uk-button uk-button-primary uk-margin-small-left max-content-width button-small-padding"
                  onClick={() => {
                    const CONTENT_CONSTANTS_FULFILL_FORM = 1
                    handleChangeCurrentContent(CONTENT_CONSTANTS_FULFILL_FORM)
                  }}
                  id="fulfill-order-button"
                >
                  {locale.orderViewPage.fulfillOrderBtnText}
                </Button>
              </div>
            ) : null
          }
        >
          <div className="uk-flex">
            <h5 className="uk-text-bold">
              <Link to={`/profile/${order.contract.vendorListings[0].vendorID.peerID}`}>
                {order.vendor ? order.vendor!.name : ''}
              </Link>
            </h5>
          </div>
          <p className="color-secondary">
            {order.role === 'vendor' ? (
              <>
                {`${locale.orderViewPage.orderAcceptedParagraph1} `}
                <a href={`${config.host}/#/profile/${order.buyer!.peerID}`}>
                  {order.buyer!.name}
                </a>{' '}
                {locale.orderViewPage.orderAcceptedParagraph2}
              </>
            ) : (
              locale.orderViewPage.orderAcceptedParagraph3
            )}
          </p>
        </SimpleBorderedSegment>
      </OrderSummaryItemSegment>
    </div>
  )
}

export default OrderFulfillForm
