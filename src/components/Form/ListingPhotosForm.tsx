import React, { useState } from 'react'

import { FormLabel } from '../Label'
import { ThumbnavSlideshow } from '../Thumbnav'

interface Props {
  handleContinue: (event: React.FormEvent) => void
  images: string[]
  onChange: (images: string[]) => void
}

const ListingPhotosForm = ({ images, handleContinue, onChange }: Props) => {
  return (
    <form className="uk-form-stacked  uk-flex uk-flex-column full-width">
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label="ADD PHOTO (Include up to 30 photos)" required />
          <ThumbnavSlideshow images={images} onChange={onChange} />
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
