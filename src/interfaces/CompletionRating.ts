export interface CompletionRating {
  dst: string
  dstpk: Dstpk
  rating: CompletionRatingInformation
  sig: Sig[]
  src: string
  srcpk: Dstpk
  type: string
}

export interface Dstpk {
  bitcoin: string
  identity: string
}

export interface CompletionRatingInformation {
  key: string
  orderId: string
  ratings: RatingElement[]
  timestamp: string
  average: number
}

export interface RatingElement {
  ratingData: RatingData
  signature: string
}

export interface RatingData {
  buyerID: RID
  buyerName: string
  buyerSig: string
  customerService: number
  deliverySpeed: number
  description: number
  overall: number
  quality: number
  ratingKey: string
  review: string
  timestamp: string
  vendorID: RID
  vendorSig: VendorSig
}

export interface RID {
  bitcoinSig: string
  handle: string
  peerID: string
  pubkeys: Dstpk
}

export interface VendorSig {
  metadata: Metadata
  signature: string
}

export interface Metadata {
  listingSlug: string
  listingTitle: string
  ratingKey: string
  thumbnail: Thumbnail
}

export interface Thumbnail {
  filename: string
  large: string
  medium: string
  original: string
  small: string
  tiny: string
}

export interface Sig {
  section: string
  signatureBytes: string
}
