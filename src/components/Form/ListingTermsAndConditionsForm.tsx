import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import ReactMde from 'react-mde'

import { Button } from '../Button'
import { FormLabel } from '../Label'

import { TabSelection } from '../../interfaces/Misc'
import decodeHtml from '../../utils/Unescape'

import { localeInstance } from '../../i18n'

import 'react-mde/lib/styles/css/react-mde-all.css'

interface Props {
  handleInputChange: (field: string, value: string, parentField?: string) => void
  termsAndConditions: string
  handleContinue: (event: React.FormEvent) => void
  handleFullSubmit: (event: React.FormEvent) => void
  isNew: boolean
}

const ListingTermsAndConditionsForm = ({
  handleInputChange,
  handleContinue,
  termsAndConditions,
  isNew,
  handleFullSubmit,
}: Props) => {
  const {
    localizations,
    localizations: { listingForm },
  } = localeInstance.get

  const [st, setSelectedTab] = useState('write')
  const selectedTab: TabSelection = st as TabSelection

  return (
    <form className="uk-form-stacked uk-flex uk-flex-column full-width">
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label={listingForm.termsAndConditionsLabel.toUpperCase()} />
          <ReactMde
            onChange={value => handleInputChange('termsAndConditions', value, 'listing')}
            value={decodeHtml(termsAndConditions)}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={markdown => {
              return new Promise((resolve, reject) => {
                resolve(<ReactMarkdown source={markdown} />)
              })
            }}
          />
          <label className="form-label-desciptor">{listingForm.termsAndConditionsDescriptor}</label>
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

export default ListingTermsAndConditionsForm
