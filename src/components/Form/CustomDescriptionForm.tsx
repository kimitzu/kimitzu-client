import React, { useEffect, useState } from 'react'

import { Button } from '../Button'
import { FormLabel } from '../Label'

import Characteristics from '../../constants/PhysicalCharacteristics.json'
import { localeInstance } from '../../i18n'
import { CustomDescription } from '../../interfaces/Profile'
import Profile from '../../models/Profile'

import './CustomDescriptionForm.css'

const PhysicalCharacteristics = { ...Characteristics }
PhysicalCharacteristics[''] = ''

interface CustomDescriptionProps {
  profile: Profile
}

const CustomDescriptionForm = ({ profile }: CustomDescriptionProps) => {
  const {
    localizations,
    localizations: { customDescriptionForm },
  } = localeInstance.get
  const customDescriptions: CustomDescription[] = []
  const [descriptions, setDescriptions] = useState(customDescriptions)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)
  const [hoverIndex, setHoverIndex] = useState(-1)

  const changeHandler = (field, value, index) => {
    descriptions[index][field] = value
    setDescriptions([...descriptions])
  }

  const deleteHandler = index => {
    descriptions.splice(index, 1)
    setDescriptions([...descriptions])
  }

  useEffect(() => {
    if (profile.customFields && profile.customFields.length > 0) {
      setDescriptions([...profile.customFields])
    }
  }, [])

  return (
    <form
      className="uk-form-stacked uk-width-1-1"
      onSubmit={async evt => {
        evt.preventDefault()
        profile.customFields = descriptions
        setIsUpdating(true)
        await profile.update()
        window.UIkit.notification(customDescriptionForm.saveSuccessNotif, { status: 'success' })
        setIsUpdating(false)
      }}
    >
      <fieldset className="uk-fieldset">
        {descriptions.map((description, index) => {
          const descriptionElementValue =
            PhysicalCharacteristics[descriptions[index] ? descriptions[index].label : '']

          return (
            <div
              key={description.label}
              className="uk-card uk-card-default uk-padding-small uk-margin-small-top"
              onMouseOver={() => {
                setHoverIndex(index)
              }}
            >
              <div className="uk-width-1-1 uk-margin-small-top">
                <FormLabel label={customDescriptionForm.labelLabel} />
                <div className="uk-form-controls">
                  <select
                    className="uk-select"
                    id="form-stacked-select"
                    onChange={evt => {
                      changeHandler('label', evt.target.value, selectedIndex)
                      /**
                       * Initialize default blank value
                       */
                      changeHandler('value', descriptionElementValue[0], selectedIndex)
                    }}
                    onFocus={() => {
                      setSelectedIndex(index)
                    }}
                    value={descriptions[index] ? descriptions[index].label : ''}
                  >
                    {Object.keys(PhysicalCharacteristics).map((key, pcIndex) => {
                      return (
                        <option value={key} key={pcIndex}>
                          {key}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <div className="uk-width-1-1 uk-margin-small-top">
                <FormLabel label={customDescriptionForm.valueLabel} />
                <div className="uk-form-controls">
                  {descriptionElementValue.choices ? (
                    <select
                      className="uk-select"
                      id="form-stacked-select"
                      onChange={evt => {
                        changeHandler('value', evt.target.value, selectedIndex)
                      }}
                      value={descriptions[index].value}
                    >
                      {descriptionElementValue.choices.map((selection, pdIndex) => {
                        return (
                          <option key={pdIndex} value={selection}>
                            {selection}
                          </option>
                        )
                      })}
                    </select>
                  ) : (
                    <>
                      <input
                        type={descriptionElementValue}
                        value={descriptions[index].value}
                        onChange={evt => {
                          changeHandler('value', evt.target.value, selectedIndex)
                        }}
                        onFocus={() => {
                          setSelectedIndex(index)
                        }}
                        className="uk-input"
                        data-uk-tooltip={
                          description.label === 'Age'
                            ? null
                            : 'Please use only metric units for the meantime (kg/cm)'
                        }
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="close-button-custom-desc">
                {hoverIndex === index ? (
                  <span
                    className="uk-margin-top cursor-pointer"
                    onClick={() => {
                      deleteHandler(index)
                    }}
                    uk-icon="close"
                  />
                ) : null}
              </div>
            </div>
          )
        })}
        <div className="uk-margin">
          <Button
            type="button"
            className="uk-button uk-button-default"
            onClick={() => {
              setDescriptions([...descriptions, { label: '', value: '' }])
            }}
          >
            {customDescriptionForm.submitBtnText}
          </Button>
        </div>
      </fieldset>
      <div className="uk-margin-top">
        {isUpdating ? (
          <div uk-spinner="ratio: 1" />
        ) : (
          <Button className="uk-button uk-button-primary uk-align-center" type="submit">
            {localizations.saveBtnText.toUpperCase()}
          </Button>
        )}
      </div>
    </form>
  )
}

export default CustomDescriptionForm
