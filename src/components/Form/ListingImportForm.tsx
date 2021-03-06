import React from 'react'

import { Button } from '../Button'
import { FormLabel } from '../Label'
import { ThumbnavJSON } from '../Thumbnav'

import { localeInstance } from '../../i18n'

import './ListingImportForm.css'

interface Props {
  jsons: string[]
  onChange: (images: string[]) => void
  handleFullSubmit: (event: React.FormEvent) => void
  isNew: boolean
}

const ListingImportForm = ({ jsons, onChange, handleFullSubmit }: Props) => {
  const {
    localizations: { listingForm },
  } = localeInstance.get

  return (
    <div className="uk-card uk-card-default uk-card-body uk-width-1-1@m">
      <form className="uk-form-stacked  uk-flex uk-flex-column full-width">
        <fieldset className="uk-fieldset">
          <div className="uk-margin">
            <FormLabel label={listingForm.importLabel} required />
            <ThumbnavJSON jsons={jsons} onChange={onChange} />
          </div>
        </fieldset>
        <div className="submit-btn-div">
          <Button
            className="uk-button uk-button-primary uk-margin-small-right uk-margin-large-top"
            onClick={handleFullSubmit}
          >
            {listingForm.addBtnText.toUpperCase()}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ListingImportForm
