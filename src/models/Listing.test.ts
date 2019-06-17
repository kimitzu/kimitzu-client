import Listing from './Listing'

test('Properly initialize initial object state', () => {
  const listing = new Listing()
  listing.metadata.expiry = new Date('March/01/1996').toISOString()

  expect(JSON.stringify(listing)).toEqual(
    '{"item":{"title":"","description":"","processingTime":"1 day","price":0,"nsfw":false,"tags":[],"images":[{"filename":"","original":"","large":"","medium":"","small":"","tiny":""}],"categories":[],"grams":0,"condition":"New","options":[],"skus":[{"productID":"","surcharge":0,"quantity":0}]},"averageRating":0,"hash":"","location":{"addressOne":"","addressTwo":"","city":"","country":"","latitude":"","longitude":"","plusCode":"","state":"","zipCode":""},"parentPeer":"","peerSlug":"","price":{"amount":0,"currencyCode":"","modifier":0},"ratingCount":0,"thumbnail":{"medium":"","small":"","tiny":""},"signature":"","slug":"","vendorID":{"peerID":"","handle":"","pubkeys":{"identity":"","bitcoin":""},"bitcoinSig":""},"metadata":{"version":0,"contractType":"SERVICE","format":"FIXED_PRICE","expiry":"1996-02-29T16:00:00.000Z","acceptedCurrencies":[],"pricingCurrency":"usd","language":"","escrowTimeoutHours":0,"coinType":"","coinDivisibility":0,"priceModifier":0,"serviceRateMethod":"FIXED"},"shippingOptions":[],"coupons":[{"title":"","discountCode":"","percentDiscount":0,"type":"percent"}],"moderators":[],"termsAndConditions":"","refundPolicy":""}'
  )
})
