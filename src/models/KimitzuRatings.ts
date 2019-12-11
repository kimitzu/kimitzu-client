import { CompletionRating, CompletionRatingInformation } from '../interfaces/CompletionRating'
import { FulfillmentRating, FulfillmentRatingInformation } from '../interfaces/FulfillmentRating'

abstract class KimitzuRatings {
  public type: string = ''
  public ratingCount: number = 0
  public ratingSum: number = 0
  public ratings: FulfillmentRatingInformation[] | CompletionRatingInformation[] = []
  public peerRatingVouch: { [key: string]: number } = {}
  public maxRating: number = 5
  public averageRatingBreakdown: { [key: string]: { title: string; rating: number } } = {}

  public abstract add(rating: FulfillmentRating | CompletionRating)
  public abstract get averageRating(): number
}

export default KimitzuRatings
