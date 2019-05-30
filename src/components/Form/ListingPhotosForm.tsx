import React from 'react'

import { FormLabel } from '../Label'
import { ThumbnavSlideshow } from '../Thumbnav'

interface Props {
  handleContinue: () => void
  images: string[]
}

const ListingPhotosForm = ({ images, handleContinue }: Props) => {
  return (
    <form className="uk-form-stacked">
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label="ADD PHOTO" required />
          <ThumbnavSlideshow images={images} />
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
