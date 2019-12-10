import React from 'react'

import { Button } from '../Button'
import { FormLabel } from '../Label'
import { ThumbnavSlideshow } from '../Thumbnav'

import { localeInstance } from '../../i18n'

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
  const {
    localizations,
    localizations: { listingForm },
  } = localeInstance.get

  return (
    <form className="uk-form-stacked  uk-flex uk-flex-column full-width">
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label={listingForm.photoLabel} required />
          <ThumbnavSlideshow images={images} onChange={onChange} />
        </div>
      </fieldset>
      <div className="submit-btn-div">
        {!isNew ? (
          <Button
            className="uk-button uk-button-primary uk-margin-small-right"
            onClick={handleFullSubmit}
          >
            {listingForm.updateBtnText.toUpperCase()}
          </Button>
        ) : null}
        <Button
          className={`uk-button ${isNew ? 'uk-button-primary' : 'uk-button-default'}`}
          onClick={handleContinue}
        >
          {localizations.nextBtnText.toUpperCase()}
        </Button>
      </div>
    </form>
  )
}

export default ListingPhotosForm
