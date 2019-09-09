import React, { useState } from 'react'

import { Button } from '../Button'
import { FormLabel } from '../Label'
import { ThumbnavSlideshow } from '../Thumbnav'

interface Props {
  handleContinue: (event: React.FormEvent) => void
  images: string[]
  onChange: (images: string[]) => void
  handleFullSubmit: (event: React.FormEvent) => void
  isNew: boolean
}

const ListingPhotosForm = ({
  images,
  handleContinue,
  onChange,
  isNew,
  handleFullSubmit,
}: Props) => {
  return (
    <form className="uk-form-stacked  uk-flex uk-flex-column full-width">
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label="ADD PHOTO (Include up to 30 photos)" required />
          <ThumbnavSlideshow images={images} onChange={onChange} />
        </div>
      </fieldset>
      <div className="submit-btn-div">
        {!isNew ? (
          <Button
            className="uk-button uk-button-primary uk-margin-small-right"
            onClick={handleFullSubmit}
          >
            UPDATE LISTING
          </Button>
        ) : null}
        <Button
          className={`uk-button ${isNew ? 'uk-button-primary' : 'uk-button-default'}`}
          onClick={handleContinue}
        >
          NEXT
        </Button>
      </div>
    </form>
  )
}

export default ListingPhotosForm
