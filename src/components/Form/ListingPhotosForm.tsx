import React from 'react'

import { FormLabel } from '../Label'
import { ThumbnavSlideshow } from '../Thumbnav'

interface Props {
  handleContinue: (event: React.FormEvent) => void
  onImageOpen: (event: React.ChangeEvent<HTMLInputElement>) => void
  images: string[]
}

const ListingPhotosForm = ({ images, handleContinue, onImageOpen }: Props) => {
  return (
    <form className="uk-form-stacked  uk-flex uk-flex-column full-width">
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label="ADD PHOTO" required />
          <ThumbnavSlideshow images={images} onImageOpen={onImageOpen} />
          <label className="form-label-desciptor">Include up to 30 photos</label>
        </div>
      </fieldset>
      <div className="submit-btn-div">
        <button className="uk-button uk-button-primary" onClick={handleContinue}>
          CONTINUE
        </button>
      </div>
    </form>
  )
}

export default ListingPhotosForm
