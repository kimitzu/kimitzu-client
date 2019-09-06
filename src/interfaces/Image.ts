export default interface Image extends Thumbnail {
  filename?: string
  original: string
  large: string
}

export interface Thumbnail {
  medium: string
  small: string
  tiny: string
}
