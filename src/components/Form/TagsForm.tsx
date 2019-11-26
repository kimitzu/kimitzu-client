import React, { useState } from 'react'
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

import { Button } from '../Button'
import { FormLabel } from '../Label'

import { localeInstance } from '../../i18n'

import './TagsForm.css'

interface Props {
  tags: string[]
  onSubmit: (tags: string[]) => void
  submitLabel?: string
  formLabel?: string
  handleFullSubmit?: (event: React.FormEvent) => void
  isNew?: boolean
  isListing?: boolean
}

const TagsForm = ({
  tags,
  onSubmit,
  submitLabel,
  formLabel,
  isNew,
  handleFullSubmit,
  isListing,
}: Props) => {
  const {
    localizations,
    localizations: { listingForm },
  } = localeInstance.get
  const [rawTags, setRawTags] = useState(tags)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <form
      className="uk-form-stacked uk-flex uk-flex-column full-width"
      onSubmit={async evt => {
        evt.preventDefault()
        setIsLoading(true)
        await onSubmit(rawTags)
        setIsLoading(false)
      }}
    >
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel
            label={formLabel ? formLabel.toUpperCase() : listingForm.tagsLabel.toUpperCase()}
            required
          />
          <TagsInput
            inputProps={{ id: 'tags' }}
            value={rawTags}
            onChange={changedTags => {
              setRawTags(changedTags)
            }}
          />
          <label className="form-label-desciptor">{listingForm.tagsDescriptor}</label>
        </div>
      </fieldset>
      <div className="submit-btn-div">
        {!isNew && isListing ? (
          <Button
            className="uk-button uk-button-primary uk-margin-small-right"
            onClick={handleFullSubmit}
          >
            {listingForm.updateBtnText.toUpperCase()}
          </Button>
        ) : null}
        <Button
          className={`uk-button ${isNew || !isListing ? 'uk-button-primary' : 'uk-button-default'}`}
          type="submit"
          showSpinner={isLoading}
        >
          {submitLabel || localizations.nextBtnText.toUpperCase()}
        </Button>
      </div>
    </form>
  )
}

export default TagsForm
