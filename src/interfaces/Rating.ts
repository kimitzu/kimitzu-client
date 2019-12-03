import Image from './Image'
import UserID from './UserID'

export type RatingHandler = (index: number, value: number, ratingType: string) => void

export default interface Rating {
  ratingData: RatingData
  signature: string
  avatar?: string // will be use for rendering reviews
}

export interface RatingData {
  ratingKey: string
  vendorID: UserID
  vendorSig: RatingSignature
  buyerID: UserID
  buyerName: string
  buyerSig: string
  timestamp: string
  overall: number
  quality: number
  description: number
  deliverySpeed: number
  customerService: number
  review: string
}

interface RatingSignature {
  metadata: RatingSignatureMetadata
  signature: string
}

interface RatingSignatureMetadata {
  listingSlug: string
  ratingKey: string
  listingTitle: string
  thumbnail: Image
}

export interface RatingInput {
  title: string
  fieldName: string
  value: number
  index: number
  starCount?: number
  description?: string
}

export interface RatingSummary {
  average: number
  count: number
  kimitzu?: KimitzuRating
  ratings: string[]
  slug: string
}

export interface KimitzuRating {
  average: number
  count: number
  buyerRatings?: KimitzuRatingItem[]
  vendorRatings?: KimitzuRatingItem[]
}

export interface KimitzuRatingItem {
  orderId: string
  slug: string
  comment: string
  fields: KimitzuRatingItemFields[]
  sourceId: string
  targetId: string
  timestamp: string
  avatar?: string // will be use for rendering reviews
  reviewer?: string // will be use for rendering reviews
}

interface KimitzuRatingItemFields {
  max: number
  score: number
  weight: number
  type?: number
}

export interface UserReview {
  imgSrc?: string
  peerID: string
  reviewer: string
  review: string
  timestamp?: string
  averageRating: number
}
