import { CompletionRating, CompletionRatingInformation } from '../interfaces/CompletionRating'
import KimitzuRatings from './KimitzuRatings'

class KimitzuCompletionRatings extends KimitzuRatings {
  public type: string = 'complete'
  public ratingCount: number = 0
  public ratingSum: number = 0
  public ratings: CompletionRatingInformation[] = []
  public peerRatingVouch: { [key: string]: number } = {}
  public averageRatingBreakdown: { [key: string]: { title: string; rating: number } } = {}

  public add(rating: CompletionRating) {
    const vouchKey = `${rating.rating.orderId}-${rating.type}`

    if (!this.peerRatingVouch[vouchKey]) {
      this.ratingCount += 1

      this.averageRatingBreakdown.customerService = {
        title: 'customerService',
        rating: rating.rating.ratings[0].ratingData.customerService,
      }
      this.averageRatingBreakdown.deliverySpeed = {
        title: 'deliverySpeed',
        rating: rating.rating.ratings[0].ratingData.deliverySpeed,
      }
      this.averageRatingBreakdown.description = {
        title: 'description',
        rating: rating.rating.ratings[0].ratingData.description,
      }
      this.averageRatingBreakdown.overall = {
        title: 'overall',
        rating: rating.rating.ratings[0].ratingData.overall,
      }
      this.averageRatingBreakdown.quality = {
        title: 'quality',
        rating: rating.rating.ratings[0].ratingData.quality,
      }

      const OPENBAZAAR_RATING_FIELDS = 5

      let singleAverageRating = rating.rating.ratings[0].ratingData.customerService
      singleAverageRating += rating.rating.ratings[0].ratingData.deliverySpeed
      singleAverageRating += rating.rating.ratings[0].ratingData.description
      singleAverageRating += rating.rating.ratings[0].ratingData.overall
      singleAverageRating += rating.rating.ratings[0].ratingData.quality
      rating.rating.average = singleAverageRating / OPENBAZAAR_RATING_FIELDS
      this.ratingSum += rating.rating.average

      rating.rating.key = vouchKey
      this.ratings.push(rating.rating)
      this.peerRatingVouch[vouchKey] = 1
    } else {
      this.peerRatingVouch[vouchKey] += 1
    }
  }

  public get averageRating() {
    return this.ratingSum / this.ratingCount
  }
}

export default KimitzuCompletionRatings
