import { CompletionRating } from '../interfaces/CompletionRating'
import KimitzuCompletionRatings from './KimitzuCompletionRatings'

describe('Kimitzu Completion Ratings', () => {
  it('Should properly initialize object', () => {
    const kimitzuCompletionRatings = new KimitzuCompletionRatings()
    expect(JSON.stringify(kimitzuCompletionRatings)).toEqual(
      `{"type":"complete","ratingCount":0,"ratingSum":0,"ratings":[],"peerRatingVouch":{},"maxRating":5,"averageRatingBreakdown":{}}`
    )
  })

  it('Should apppend and calculate total rating', () => {
    const rating = {
      dst: 'QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK@diverse-reboot',
      dstpk: {
        bitcoin: 'A0uKZuifiI7681Csa4O2208Uh3/TCQlSwAis2o/NwA1y',
        identity: 'CAESIKX2OM1r2otRNO2JlZnNMJQt5m1Ck57lnKbWgfrWyPgv',
      },
      rating: {
        orderId: 'QmWB7iHnsh6HXCNmuRgWNwLpTYvzTiqMEBwm7huxzhaBb4',
        ratings: [
          {
            ratingData: {
              buyerID: {
                bitcoinSig:
                  'MEQCIGWX4Di0/t9GSp68iI/tAkWYVdnVesWfdjZsHhFCvDTKAiAtOSPUELCJDxVAWpeM3iMHfek/oQWwmmftp6wvvlaAdg==',
                handle: 'Dell',
                peerID: 'QmcoCp8fZxgfjV6TZGizkTs2b6CZKhJPsueX7jqrx2preG',
                pubkeys: {
                  bitcoin: 'A6/TUgrtU8z77V2MbqGefIN0u7v6H2EczpPdzknIlgIE',
                  identity: 'CAESIKEH9KOhGmIs2UZfmlwwSwZWGHerVVHPw4UpRjqD6JAn',
                },
              },
              buyerName: 'Dell Gamer',
              buyerSig:
                'g8GCE9njWi4toBca/FRHBX4UuPg7iXkMb0kfRRxFVwmyatrnMReob7LHMyox+Cq7XXFje82vzgeKOE33ODPgAg==',
              customerService: 5,
              deliverySpeed: 4,
              description: 5,
              overall: 5,
              quality: 4,
              ratingKey: 'AkpD96pliEiualcTw71KwvmoRmcUqp9ocR5sN7SHTfau',
              review: 'hello world',
              timestamp: '2020-01-02T10:31:11.141012100Z',
              vendorID: {
                bitcoinSig:
                  'MEQCIHmlmstMukJfXu+ekkLIV6whUH3pmkqivjHE5akbmEzGAiAXX9+QzLVJzqb/vNz52bwDNNT18Oo4/L8+TFb/gTjoNw==',
                handle: 'Djali',
                peerID: 'QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK',
                pubkeys: {
                  bitcoin: 'A0uKZuifiI7681Csa4O2208Uh3/TCQlSwAis2o/NwA1y',
                  identity: 'CAESIKX2OM1r2otRNO2JlZnNMJQt5m1Ck57lnKbWgfrWyPgv',
                },
              },
              vendorSig: {
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
            },
            signature:
              'MEQCIHRDND99wcSvPuRi6IOePvOSD0yLTUTNZMaRk0zT1OCMAiAG3JeUjdgw+qpAVR173ceWCG0xYnUD1DWmg+jAW5oNgQ==',
          },
        ],
        timestamp: '2020-01-02T10:31:11.140015100Z',
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
        {
          section: 'ORDER_COMPLETION',
          signatureBytes:
            '+b5RS+vVV9S+JHapNfIExxV48bOm+EZkowrqEmEb3cqwbko6Y+1FoVu2tTQSTMMUZ+dohxtLUcafHM5LJ2vJCw==',
        },
      ],
      src: 'QmcoCp8fZxgfjV6TZGizkTs2b6CZKhJPsueX7jqrx2preG',
      srcpk: {
        bitcoin: 'A6/TUgrtU8z77V2MbqGefIN0u7v6H2EczpPdzknIlgIE',
        identity: 'CAESIKEH9KOhGmIs2UZfmlwwSwZWGHerVVHPw4UpRjqD6JAn',
      },
      type: 'complete',
    } as CompletionRating

    const kimitzuCompletionRating = new KimitzuCompletionRatings()
    kimitzuCompletionRating.add(rating)

    expect(JSON.stringify(kimitzuCompletionRating)).toEqual(
      `{"type":"complete","ratingCount":1,"ratingSum":4.6,"ratings":[{"orderId":"QmWB7iHnsh6HXCNmuRgWNwLpTYvzTiqMEBwm7huxzhaBb4","ratings":[{"ratingData":{"buyerID":{"bitcoinSig":"MEQCIGWX4Di0/t9GSp68iI/tAkWYVdnVesWfdjZsHhFCvDTKAiAtOSPUELCJDxVAWpeM3iMHfek/oQWwmmftp6wvvlaAdg==","handle":"Dell","peerID":"QmcoCp8fZxgfjV6TZGizkTs2b6CZKhJPsueX7jqrx2preG","pubkeys":{"bitcoin":"A6/TUgrtU8z77V2MbqGefIN0u7v6H2EczpPdzknIlgIE","identity":"CAESIKEH9KOhGmIs2UZfmlwwSwZWGHerVVHPw4UpRjqD6JAn"}},"buyerName":"Dell Gamer","buyerSig":"g8GCE9njWi4toBca/FRHBX4UuPg7iXkMb0kfRRxFVwmyatrnMReob7LHMyox+Cq7XXFje82vzgeKOE33ODPgAg==","customerService":5,"deliverySpeed":4,"description":5,"overall":5,"quality":4,"ratingKey":"AkpD96pliEiualcTw71KwvmoRmcUqp9ocR5sN7SHTfau","review":"hello world","timestamp":"2020-01-02T10:31:11.141012100Z","vendorID":{"bitcoinSig":"MEQCIHmlmstMukJfXu+ekkLIV6whUH3pmkqivjHE5akbmEzGAiAXX9+QzLVJzqb/vNz52bwDNNT18Oo4/L8+TFb/gTjoNw==","handle":"Djali","peerID":"QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK","pubkeys":{"bitcoin":"A0uKZuifiI7681Csa4O2208Uh3/TCQlSwAis2o/NwA1y","identity":"CAESIKX2OM1r2otRNO2JlZnNMJQt5m1Ck57lnKbWgfrWyPgv"}},"vendorSig":{"metadata":{"listingSlug":"diverse-reboot","listingTitle":"Diverse reboot","ratingKey":"AkpD96pliEiualcTw71KwvmoRmcUqp9ocR5sN7SHTfau","thumbnail":{"filename":"","large":"QmP9VA72WvzD6TQdn6FwudvntvFG1364ocVbEDwWuecTGj","medium":"QmXPAFTj3cqp516Ma6ZRqJ4cTxEueYAAcpUBg9MiKUTarv","original":"QmdZ2rdmU87zToKcMNmzWCDMMiwjJVGBMA73BvvLEcpuiE","small":"QmQCJcu8x3z9ioAtFfPjeyeTkpPDg2h9jD7QzEbJGBCydY","tiny":"QmV6Fb9FxodjjwdWCYH4ZHmCZqAv3L5zxfg4DSD17jypXf"}},"signature":"zD+fEf2hw+Mf7i2+OK+M25F83C2Ih8A6y7AfGmiCmse2mAFSDV5BhLd4/kJdr+/8LTAxCgPD8KlNJEJNr+mUDQ=="}},"signature":"MEQCIHRDND99wcSvPuRi6IOePvOSD0yLTUTNZMaRk0zT1OCMAiAG3JeUjdgw+qpAVR173ceWCG0xYnUD1DWmg+jAW5oNgQ=="}],"timestamp":"2020-01-02T10:31:11.140015100Z","average":4.6,"key":"QmWB7iHnsh6HXCNmuRgWNwLpTYvzTiqMEBwm7huxzhaBb4-complete"}],"peerRatingVouch":{"QmWB7iHnsh6HXCNmuRgWNwLpTYvzTiqMEBwm7huxzhaBb4-complete":1},"maxRating":5,"averageRatingBreakdown":{"customerService":{"title":"customerService","rating":5},"deliverySpeed":{"title":"deliverySpeed","rating":4},"description":{"title":"description","rating":5},"overall":{"title":"overall","rating":5},"quality":{"title":"quality","rating":4}}}`
    )
  })
})
