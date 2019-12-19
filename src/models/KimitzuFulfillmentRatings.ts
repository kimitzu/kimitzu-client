import { FulfillmentRating, FulfillmentRatingInformation } from '../interfaces/FulfillmentRating'
import KimitzuRatings from './KimitzuRatings'

class KimitzuFulfillmentRatings extends KimitzuRatings {
  public type: string = 'fulfill'
  public ratingCount: number = 0
  public ratingSum: number = 0
  public ratings: FulfillmentRatingInformation[] = []
  public peerRatingVouch: { [key: string]: number } = {}
  public averageRatingBreakdown: { [key: string]: { title: string; rating: number } } = {}

  public add(rating: FulfillmentRating) {
    const vouchKey = `${rating.rating.orderId}-${rating.type}`

    if (!this.peerRatingVouch[vouchKey]) {
      let singleAverageRating = 0
      this.peerRatingVouch[vouchKey] = 1
      this.ratingCount += 1
      rating.rating.buyerRating.fields.forEach(field => {
        if (!this.averageRatingBreakdown[field.type]) {
          this.averageRatingBreakdown[field.type] = {
            title: field.type,
            rating: field.score,
          }
        } else {
          this.averageRatingBreakdown[field.type].rating += field.score
        }
        singleAverageRating += field.score
      })
      rating.rating.average = singleAverageRating / rating.rating.buyerRating.fields.length
      rating.rating.key = vouchKey
      this.ratingSum += rating.rating.average
      this.ratings.push(rating.rating)
    } else {
      this.peerRatingVouch[vouchKey] += 1
    }
  }

  public get averageRating() {
    return this.ratingSum / this.ratingCount
  }
}

export default KimitzuFulfillmentRatings
