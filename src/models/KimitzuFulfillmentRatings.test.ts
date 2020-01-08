import { FulfillmentRating } from '../interfaces/FulfillmentRating'
import KimitzuFulfillmentRatings from './KimitzuFulfillmentRatings'

describe('Kimitzu Completion Ratings', () => {
  it('Should properly initialize object', () => {
    const kimitzuFulfillmentRatings = new KimitzuFulfillmentRatings()
    expect(JSON.stringify(kimitzuFulfillmentRatings)).toEqual(
      `{"type":"fulfill","ratingCount":0,"ratingSum":0,"ratings":[],"peerRatingVouch":{},"maxRating":5,"averageRatingBreakdown":{}}`
    )
  })

  it('Should apppend and calculate total rating', () => {
    const rating = {
      dst: 'QmcoCp8fZxgfjV6TZGizkTs2b6CZKhJPsueX7jqrx2preG',
      dstpk: {
        bitcoin: 'A6/TUgrtU8z77V2MbqGefIN0u7v6H2EczpPdzknIlgIE',
        identity: 'CAESIKEH9KOhGmIs2UZfmlwwSwZWGHerVVHPw4UpRjqD6JAn',
      },
      rating: {
        buyerRating: {
          comment: '1234567890',
          fields: [
            { max: 5, score: 5, type: 'OUTSIDE_WORK_COMP', weight: 100 },
            { max: 5, score: 4, type: 'READ_LISTING', weight: 100 },
            { max: 5, score: 5, type: 'SCOPE_ACCURATE', weight: 100 },
            { max: 5, score: 4, type: 'FAST_RESPONSE', weight: 100 },
          ],
          vendorID: 'QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK',
        },
        note: 'qwertyuiop',
        orderId: 'QmWB7iHnsh6HXCNmuRgWNwLpTYvzTiqMEBwm7huxzhaBb4',
        ratingSignature: {
          metadata: {
            listingSlug: 'diverse-reboot',
            listingTitle: 'Diverse reboot',
            ratingKey: 'AkpD96pliEiualcTw71KwvmoRmcUqp9ocR5sN7SHTfau',
            thumbnail: {
              filename: '',
              large: 'QmP9VA72WvzD6TQdn6FwudvntvFG1364ocVbEDwWuecTGj',
              medium: 'QmXPAFTj3cqp516Ma6ZRqJ4cTxEueYAAcpUBg9MiKUTarv',
              original: 'QmdZ2rdmU87zToKcMNmzWCDMMiwjJVGBMA73BvvLEcpuiE',
              small: 'QmQCJcu8x3z9ioAtFfPjeyeTkpPDg2h9jD7QzEbJGBCydY',
              tiny: 'QmV6Fb9FxodjjwdWCYH4ZHmCZqAv3L5zxfg4DSD17jypXf',
            },
          },
          signature:
            'zD+fEf2hw+Mf7i2+OK+M25F83C2Ih8A6y7AfGmiCmse2mAFSDV5BhLd4/kJdr+/8LTAxCgPD8KlNJEJNr+mUDQ==',
        },
        slug: 'diverse-reboot',
        timestamp: '2020-01-02T10:28:22.835918420Z',
      },
      sig: [
        {
          section: 'LISTING',
          signatureBytes:
            'bXDgPhDT6IuDROfwJ5f89Ty7RL1wZX3u/bjtlmSzHTbdvNvmLPrN60X2tZNOCSk3WfZPu4fgteJ19NIZwxEuAA==',
        },
        {
          section: 'ORDER',
          signatureBytes:
            'r5bMhK3DA9oHDI1/zyRm5eph3WWKxSTtIw57HOKfx7a4FM2TmF6hpIqYdNlHUKFLP7oOJY6hsAn3suGLl47BAQ==',
        },
        {
          section: 'ORDER_CONFIRMATION',
          signatureBytes:
            'QT2zUEKgYpa/WWWjkLZfq5Jgy90fdbDNewgBrZ6MfaHdMcoSz55UwdKn8h6NlvZndjjiJ22lapsvnNYIpmikCw==',
        },
        {
          section: 'ORDER_FULFILLMENT',
          signatureBytes:
            'Qr1QT+IkHGEavI1d/iFx7nPzGrQHAm2guKWJ3CfwwHZWSSjFAWo1gCVkTNWKmO93G7lKH8wwzTCQ02qGkYnQCQ==',
        },
      ],
      src: 'QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK',
      srcpk: {
        bitcoin: 'A0uKZuifiI7681Csa4O2208Uh3/TCQlSwAis2o/NwA1y',
        identity: 'CAESIKX2OM1r2otRNO2JlZnNMJQt5m1Ck57lnKbWgfrWyPgv',
      },
      type: 'fulfill',
    } as FulfillmentRating

    const kimitzuFulfillmentRatings = new KimitzuFulfillmentRatings()
    kimitzuFulfillmentRatings.add(rating)

    const expectedObject = {
      type: 'fulfill',
      ratingCount: 1,
      ratingSum: 4.5,
      ratings: [
        {
          buyerRating: {
            comment: '1234567890',
            fields: [
              { max: 5, score: 5, type: 'OUTSIDE_WORK_COMP', weight: 100 },
              { max: 5, score: 4, type: 'READ_LISTING', weight: 100 },
              { max: 5, score: 5, type: 'SCOPE_ACCURATE', weight: 100 },
              { max: 5, score: 4, type: 'FAST_RESPONSE', weight: 100 },
            ],
            vendorID: 'QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK',
          },
          note: 'qwertyuiop',
          orderId: 'QmWB7iHnsh6HXCNmuRgWNwLpTYvzTiqMEBwm7huxzhaBb4',
          ratingSignature: {
            metadata: {
              listingSlug: 'diverse-reboot',
              listingTitle: 'Diverse reboot',
              ratingKey: 'AkpD96pliEiualcTw71KwvmoRmcUqp9ocR5sN7SHTfau',
              thumbnail: {
                filename: '',
                large: 'QmP9VA72WvzD6TQdn6FwudvntvFG1364ocVbEDwWuecTGj',
                medium: 'QmXPAFTj3cqp516Ma6ZRqJ4cTxEueYAAcpUBg9MiKUTarv',
                original: 'QmdZ2rdmU87zToKcMNmzWCDMMiwjJVGBMA73BvvLEcpuiE',
                small: 'QmQCJcu8x3z9ioAtFfPjeyeTkpPDg2h9jD7QzEbJGBCydY',
                tiny: 'QmV6Fb9FxodjjwdWCYH4ZHmCZqAv3L5zxfg4DSD17jypXf',
              },
            },
            signature:
              'zD+fEf2hw+Mf7i2+OK+M25F83C2Ih8A6y7AfGmiCmse2mAFSDV5BhLd4/kJdr+/8LTAxCgPD8KlNJEJNr+mUDQ==',
          },
          slug: 'diverse-reboot',
          timestamp: '2020-01-02T10:28:22.835918420Z',
          average: 4.5,
          key: 'QmWB7iHnsh6HXCNmuRgWNwLpTYvzTiqMEBwm7huxzhaBb4-fulfill',
        },
      ],
      peerRatingVouch: { 'QmWB7iHnsh6HXCNmuRgWNwLpTYvzTiqMEBwm7huxzhaBb4-fulfill': 1 },
      maxRating: 5,
      averageRatingBreakdown: {
        OUTSIDE_WORK_COMP: { title: 'OUTSIDE_WORK_COMP', rating: 5 },
        READ_LISTING: { title: 'READ_LISTING', rating: 4 },
        SCOPE_ACCURATE: { title: 'SCOPE_ACCURATE', rating: 5 },
        FAST_RESPONSE: { title: 'FAST_RESPONSE', rating: 4 },
      },
    }

    expect(JSON.stringify(kimitzuFulfillmentRatings)).toEqual(JSON.stringify(expectedObject))
  })
})
