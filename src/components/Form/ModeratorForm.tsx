import React, { useEffect, useState } from 'react'
import ReactSlider from 'react-slider'
import { WithContext as ReactTags } from 'react-tag-input'
import { FormLabel } from '../Label'
import { FormSelector } from '../Selector'

import FeeTypes from '../../constants/FeeTypes.json'
import FiatCurrencies from '../../constants/FiatCurrencies.json'
import Languages from '../../constants/Languages.json'
import { Moderator } from '../../interfaces/Moderator'

import Profile from '../../models/Profile'
import './ModeratorForm.css'

const parsedLanguages = Languages.map(m => {
  return {
    id: m.value,
    text: m.label,
  }
})

interface Tag {
  id: string
  text: string
}

const KeyCodes = {
  comma: 188,
  enter: 13,
}

const delimiters = [KeyCodes.comma, KeyCodes.enter]

interface Props {
  profile: Profile
}

const moderatorBaseObject = {
  description: '',
  termsAndConditions: '',
  languages: [],
  fee: {
    feeType: 'FIXED',
    fixedFee: {
      amount: 0,
      currencyCode: '',
    },
  },
} as Moderator

const ModeratorForm = (props: Props) => {
  const [languageTags, setLanguageTags] = useState([] as Tag[])
  const [moderator, setModerator] = useState(moderatorBaseObject)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [enableModerator, setEnableModerator] = useState(false)

  const handleDelete = (i: number, model: string) => {
    switch (model) {
      case 'languages': {
        const newTags = languageTags.filter((tag: Tag, index) => index !== i)
        setLanguageTags(newTags)
        break
      }
    }
  }

  const handleAddition = (tag: Tag, model: string) => {
    switch (model) {
      case 'languages': {
        setLanguageTags(newTags => [...newTags, tag])
        break
      }
    }
  }

  const handleFeeTypeChange = feeType => {
    moderator.fee.feeType = feeType

    switch (feeType) {
      case 'FIXED': {
        delete moderator.fee.percentage
        moderator.fee.fixedFee = {
          amount: 0,
          currencyCode: '',
        }
        break
      }
      case 'PERCENTAGE': {
        delete moderator.fee.fixedFee
        moderator.fee.percentage = 0
        break
      }
      default: {
        moderator.fee.fixedFee = {
          amount: 0,
          currencyCode: '',
        }
        moderator.fee.percentage = 0
      }
    }
    setModerator({ ...moderator })
  }

  const handleChange = (field: string, value: any) => {
    setModerator({ ...moderator, [field]: value })
  }

  useEffect(() => {
    const profile = props.profile
    const moderatorLanguagesParsed = profile.moderatorInfo.languages.map(l => {
      return parsedLanguages.find(c => l === c.id)
    }) as Tag[]
    setEnableModerator(profile.moderator)
    setLanguageTags(moderatorLanguagesParsed)
    setModerator(profile.moderatorInfo)
  }, [])

  return (
    <form
      className="uk-form-stacked"
      style={{ width: '100%' }}
      onSubmit={async evt => {
        evt.preventDefault()

        if (!enableModerator) {
          setIsSubmitting(true)
          await props.profile.unsetModerator()
          alert('Moderator profile removed!')
          setIsSubmitting(false)
          return
        }

        moderator.languages = languageTags.map(l => {
          return l.id
        })

        setIsSubmitting(true)
        await props.profile.setModerator(moderator)
        alert('Moderator profile saved!')
        setIsSubmitting(false)
      }}
    >
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <div className="uk-form-controls">
            <label>
              <input
                className="uk-checkbox"
                type="checkbox"
                checked={enableModerator}
                onChange={evt => {
                  setEnableModerator(evt.target.checked)
                }}
              />{' '}
              Enable moderator functions
            </label>
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label="DESCRIPTION" required />
          <div className="uk-form-controls">
            <textarea
              required
              disabled={!enableModerator}
              autoFocus
              className="uk-textarea"
              rows={3}
              placeholder="In 500 words or less tell us something about yourself and the services you offer..."
              value={moderator.description || ''}
              onChange={event => {
                handleChange('description', event.target.value)
              }}
            />
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label="TERMS AND CONDITIONS" required />
          <div className="uk-form-controls">
            <textarea
              required
              className="uk-textarea"
              disabled={!enableModerator}
              rows={3}
              placeholder="Enter Terms and Conditions"
              value={moderator.termsAndConditions || ''}
              onChange={event => {
                handleChange('termsAndConditions', event.target.value)
              }}
            />
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label="LANGUAGES" required />
          <div className="uk-form-controls">
            <div className="lang-tags-container">
              <ReactTags
                allowDragDrop={false}
                readOnly={!enableModerator}
                tags={languageTags}
                suggestions={parsedLanguages}
                handleDelete={i => handleDelete(i, 'languages')}
                handleAddition={tag => handleAddition(tag, 'languages')}
                delimiters={delimiters}
              />
            </div>
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label="FEE TYPE" required />
          <div id="form-select" className="uk-form-controls">
            <FormSelector
              required
              disabled={!enableModerator}
              options={FeeTypes}
              defaultVal={moderator.fee.feeType}
              onChange={event => {
                handleFeeTypeChange(event.target.value)
              }}
            />
          </div>
        </div>
        {moderator.fee.feeType === 'FIXED' || moderator.fee.feeType === 'FIXED_PLUS_PERCENTAGE' ? (
          <div className="uk-margin">
            <div className="fixed-container">
              <div className="fixed-content">
                <FormLabel label="AMOUNT" required />
                <div className="uk-form-controls">
                  <input
                    required
                    disabled={!enableModerator}
                    className="uk-input"
                    type="text"
                    placeholder="Enter amount"
                    value={moderator.fee.fixedFee!.amount || ''}
                    onChange={event => {
                      moderator.fee.fixedFee!.amount = Number(event.target.value)
                      setModerator({ ...moderator })
                    }}
                  />
                </div>
              </div>
              <div className="fixed-divider" />
              <div className="fixed-content">
                <FormLabel label="CURRENCY" required />
                <div id="form-select" className="uk-form-controls">
                  <FormSelector
                    required
                    disabled={!enableModerator}
                    options={FiatCurrencies}
                    defaultVal={moderator.fee.fixedFee!.currencyCode || 'USD'}
                    onChange={event => {
                      moderator.fee.fixedFee!.currencyCode = event.target.value
                      setModerator({ ...moderator })
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {moderator.fee.feeType === 'PERCENTAGE' ||
        moderator.fee.feeType === 'FIXED_PLUS_PERCENTAGE' ? (
          <div className="uk-margin">
            <FormLabel label="PERCENTAGE" required />
            <div className="slider-container-main">
              <div className="slider-stat">
                <div className="perc-middle">{moderator.fee.percentage}%</div>
              </div>
              <div className="slider-container">
                <ReactSlider
                  disabled={!enableModerator}
                  value={moderator.fee.percentage}
                  withBars
                  min={0}
                  max={100}
                  barClassName="bar-style"
                  onChange={e => {
                    moderator.fee.percentage = e
                    setModerator({ ...moderator })
                  }}
                >
                  <div className="my-handle" />
                </ReactSlider>
              </div>
            </div>
          </div>
        ) : null}
      </fieldset>
      <div className="uk-margin-top">
        {isSubmitting ? (
          <div uk-spinner="ratio: 1" />
        ) : (
          <button className="uk-button uk-button-primary" type="submit">
            SAVE
          </button>
        )}
      </div>
    </form>
  )
}

export default ModeratorForm

// TODO: Move to dispute component
{
  /* <div className="uk-margin">
<FormLabel label="PERCENTAGE" required />
<div className="slider-container-main">
  <div className="slider-stat">
    <div className="perc-left">Buyer: {stat}%</div>
    <div className="perc-right">Seller: {100 - stat}%</div>
  </div>
  <div className="slider-container">
    <ReactSlider
      withBars
      min={0}
      max={100}
      barClassName="bar-style"
      onChange={e => setStat(e)}
    >
      <div className="my-handle" />
    </ReactSlider>
  </div>
</div>
</div> */
}
