import Image from './Image'

export default interface UserID {
  peerID: string
  handle: string
  pubkeys: Pubkeys
  bitcoinSig: string
}

interface Pubkeys {
  identity: string
  bitcoin: string
}

interface RatingSignature {
  metadata: RatingSignatureMetadata
  signature: string
}

export interface RatingSignatureMetadata {
  listingSlug: string
  ratingKey: string
  listingTitle: string
  thumbnail: Image
}
