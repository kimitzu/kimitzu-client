import Listing from './Listing'

test('Properly initialize initial object state', () => {
  const listing = new Listing()
  const today = new Date()
  const expirationDate = new Date(listing.metadata.expiry)
  expect(today.getFullYear() + 1).toEqual(expirationDate.getFullYear())

  // Mock the expiration date
  listing.metadata.expiry = '1996-02-29T16:00:00.000Z'

  expect(JSON.stringify(listing)).toEqual(
    '{"currentUser":{"about":"","avatarHashes":{"tiny":"","small":"","medium":"","large":"","original":""},"extLocation":{"primary":0,"shipping":0,"billing":0,"return":0,"addresses":[{"type":[""],"latitude":"","longitude":"","plusCode":"","addressOne":"","addressTwo":"","city":"","state":"","country":"US","zipCode":""}]},"handle":"","moderator":false,"moderatorInfo":{"description":"","termsAndConditions":"","languages":[],"acceptedCurrencies":[],"fee":{"fixedFee":{"currencyCode":"USD","amount":0},"percentage":0,"feeType":"FIXED"}},"name":"","nsfw":false,"vendor":true,"contactInfo":{"website":"","email":"","phoneNumber":"","social":[]},"bitcoinPubkey":"","currencies":[],"headerHashes":{"tiny":"","small":"","medium":"","large":"","original":""},"location":"","metaTags":{"DjaliVersion":""},"peerID":"","preferences":{"currencyDisplay":"FIAT","fiat":"USD","cryptocurrency":"TBTC","language":"en-US","measurementUnit":"ENGLISH"},"profileType":"","shortDescription":"","stats":{"followerCount":0,"followingCount":0,"listingCount":0,"ratingCount":0,"postCount":0,"averageRating":0},"background":{"educationHistory":[],"employmentHistory":[]},"spokenLanguages":["English","Tagalog"],"programmingLanguages":["Javascript","Golang","C++"],"customFields":[],"customProps":{"programmerCompetency":"{}","competencies":"","skills":"[]"}},"isOwner":false,"item":{"title":"","description":"","processingTime":"1 day","price":0,"tags":[],"images":[{"filename":"","original":"","large":"","medium":"","small":"","tiny":""}],"categories":[],"grams":0,"condition":"New","options":[],"skus":[{"quantity":-1,"productID":""}]},"averageRating":0,"hash":"","location":{"addressOne":"","addressTwo":"","city":"","country":"","latitude":"","longitude":"","plusCode":"","state":"","zipCode":""},"parentPeer":"","peerSlug":"","price":{"amount":0,"currencyCode":"","modifier":0},"ratingCount":0,"thumbnail":{"medium":"","small":"","tiny":""},"nsfw":false,"signature":"","slug":"","currentSlug":"","vendorID":{"peerID":"","handle":"","pubkeys":{"identity":"","bitcoin":""},"bitcoinSig":""},"metadata":{"version":0,"contractType":"SERVICE","format":"FIXED_PRICE","expiry":"1996-02-29T16:00:00.000Z","acceptedCurrencies":[],"pricingCurrency":"USD","language":"","escrowTimeoutHours":0,"coinType":"","coinDivisibility":100000000,"priceModifier":0,"serviceRateMethod":"PER_HOUR","serviceClassification":""},"shippingOptions":[],"coupons":[],"moderators":[],"termsAndConditions":"","refundPolicy":""}'
  )
})
