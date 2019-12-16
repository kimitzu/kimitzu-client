import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import ReactMde from 'react-mde'

import { Listing } from '../../interfaces/Listing'
import { Button } from '../Button'
import { AutoCompleteSelect, InputSelector } from '../Input'
import { FormLabel } from '../Label'
import { RadioButtons } from '../RadioButton'
import { FormSelector } from '../Selector'
import InlineFormFields from './InlineFormFields'

import ListingTypes from '../../constants/ListingTypes.json'
import ServiceRateMethods from '../../constants/ServiceRateMethods.json'
import ServiceTypes from '../../constants/ServiceTypes.json'
import { TabSelection } from '../../interfaces/Misc'
import decodeHtml from '../../utils/Unescape'

import { localeInstance } from '../../i18n'

import 'react-mde/lib/styles/css/react-mde-all.css'

const serviceTypeIds = Object.keys(ServiceTypes)

const serviceTypes = serviceTypeIds
  .map(type => {
    const item = {
      label: ServiceTypes[type],
      value: type,
    }
    return item
  })
  .sort((a, b) => {
    if (a.label === b.label) {
      return 0
    }
    return a.label < b.label ? -1 : 1
  })

const currencies = [
  {
    label: 'USD',
    value: 'USD',
  },
]

interface Props {
  data: Listing
  handleContinue: (event: React.FormEvent) => void
  handleFullSubmit: (event: React.FormEvent) => void
  isNew: boolean
}

const ListingGeneralForm = ({ data, handleContinue, isNew, handleFullSubmit }: Props) => {
  const {
    localizations,
    localizations: { listingForm },
  } = localeInstance.get

  const skuPointer = data.item.skus[0]
  const [listing, setListing] = useState(data)
  const [st, setSelectedTab] = useState('write')
  const selectedTab: TabSelection = st as TabSelection

  const handleChange = (field, value) => {
    listing[field] = value
    setListing({ ...listing })
  }

  return (
    <form className="uk-form-stacked uk-flex uk-flex-column full-width">
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label={listingForm.classificationLabel.toUpperCase()} required />
          <div id="form-select" className="uk-form-controls">
            <AutoCompleteSelect
              id="listing-create"
              defaultSelectorVal={listing.metadata.serviceClassification!.split(':')[0] || ''}
              options={serviceTypes}
              onChange={event => {
                const occupationIndex = event.value
                const item = listing.item

                /**
                 * Note: Categories in OpenBazaar are limited to 40 characters
                 */
                item.categories = [occupationIndex]

                const metadata = listing.metadata
                metadata.serviceClassification = `${occupationIndex}: ${ServiceTypes[occupationIndex]}`

                handleChange('item', item)
                handleChange('metadata', metadata)
              }}
            />
          </div>
        </div>

        <div className="uk-margin">
          <FormLabel label={localizations.titleLabel.toUpperCase()} required />
          <input
            id="general-title"
            className="uk-input"
            type="text"
            value={decodeHtml(listing.item.title)}
            onChange={event => {
              const item = listing.item
              item.title = event.target.value
              handleChange('item', item)
            }}
          />
          <label className="form-label-desciptor">{listingForm.titleDescriptor}</label>
        </div>
        <InlineFormFields
          fields={[
            {
              component: (
                <FormSelector
                  id="general-type"
                  defaultVal={listing.metadata.contractType}
                  options={ListingTypes}
                  onChange={event => {
                    const metadata = listing.metadata
                    metadata.contractType = event.target.value
                    handleChange('metadata', metadata)
                  }}
                  disabled
                />
              ),
              label: {
                name: localizations.typeLabel.toUpperCase(),
                required: true,
              },
            },
            {
              component: (
                <InputSelector
                  id="general-price"
                  options={currencies}
                  inputProps={{
                    value: listing.item.price,
                    type: 'number',
                    onChange: event => {
                      const item = listing.item
                      item.price = event.target.value
                      handleChange('item', item)
                    },
                  }}
                  selectProps={{
                    onChange: event => {
                      const metadata = listing.metadata
                      metadata.pricingCurrency = event.target.value
                    },
                  }}
                />
              ),
              label: {
                name: listingForm.priceLabel.toUpperCase(),
                required: true,
              },
              descriptiveLabel: listingForm.priceDescriptor,
            },
            {
              component: (
                <FormSelector
                  id="general-rate-method"
                  defaultVal={listing.metadata.serviceRateMethod}
                  options={ServiceRateMethods}
                  disabled={listing.metadata.contractType !== 'SERVICE'}
                  onChange={event => {
                    const metadata = listing.metadata
                    metadata.serviceRateMethod = event.target.value
                    handleChange('metadata', metadata)
                  }}
                />
              ),
              label: {
                name: listingForm.rateMethodLabel.toUpperCase(),
                required: true,
              },
              descriptiveLabel: listingForm.rateMethodDescriptor,
            },
          ]}
        />
        <InlineFormFields
          fields={[
            {
              component: (
                <input
                  className="uk-input"
                  type="text"
                  value={skuPointer.quantity < 0 ? '' : skuPointer.quantity}
                  onChange={event => {
                    const value = Number(event.target.value)
                    if (event.target.value === '') {
                      skuPointer.quantity = -1
                    } else if (value || value === 0) {
                      skuPointer.quantity = value
                    } else {
                      skuPointer.quantity = -1
                    }

                    const item = listing.item
                    item.skus = [skuPointer]

                    handleChange('item', item)
                  }}
                />
              ),
              label: {
                name: listingForm.serviceQuantityLabel.toUpperCase(),
              },
              descriptiveLabel: listingForm.serviceQuantityDescriptor,
            },
            {
              component: (
                <RadioButtons
                  options={[
                    {
                      label: localizations.yesText,
                      value: true,
                    },
                    {
                      label: localizations.noText,
                      value: false,
                    },
                  ]}
                  selectedVal={listing.nsfw.toString()}
                  handleSelect={selectedItem => {
                    const selectedItemBoolean = selectedItem as boolean
                    handleChange('nsfw', selectedItemBoolean)
                  }}
                />
              ),
              label: {
                name: `${listingForm.matureContentLabel.toUpperCase()} (NSFW, Adult, 18+, etc)`,
              },
              // descriptiveLabel: 'The overall condition of your listing',
            },
          ]}
        />
        <div className="uk-margin">
          <FormLabel label={localizations.descriptionLabel.toUpperCase()} />
          <ReactMde
            value={decodeHtml(listing.item.description)}
            onChange={value => {
              const item = listing.item
              item.description = value
              handleChange('item', item)
            }}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={markdown => {
              return new Promise((resolve, reject) => {
                resolve(<ReactMarkdown source={markdown} />)
              })
            }}
          />
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

export default ListingGeneralForm
