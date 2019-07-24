export type RatingHandler = (index: number, value: number, ratingType: string) => void

export default interface Rating {
  title: string
  fieldName: string
  value: number
  index: number
  starCount?: number
}
