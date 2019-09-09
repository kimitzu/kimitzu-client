import React, { useEffect, useState } from 'react'

import { Button } from '../Button'
import { FormLabel } from '../Label'

import { CustomDescription } from '../../interfaces/Profile'
import Profile from '../../models/Profile'
import decodeHtml from '../../utils/Unescape'

interface CustomDescriptionProps {
  profile: Profile
}

const CustomDescriptionForm = ({ profile }: CustomDescriptionProps) => {
  const customDescriptions: CustomDescription[] = []
  const [descriptions, setDescriptions] = useState(customDescriptions)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)
  const [hoverIndex, setHoverIndex] = useState(-1)

  const changeHandler = (label, value, index) => {
    descriptions[index][label] = value
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
        window.UIkit.notification('Profile Updated!', { status: 'success' })
        setIsUpdating(false)
      }}
    >
      <fieldset className="uk-fieldset">
        {descriptions.map((description, index) => (
          <div
            key={description.label}
            className="uk-margin uk-flex uk-flex-row uk-flex-middle uk-flex-1"
            onMouseOver={() => {
              setHoverIndex(index)
            }}
          >
            <div className="uk-width-1-1">
              <FormLabel label="Label" />
              <div className="uk-form-controls">
                <input
                  autoFocus
                  className="uk-input"
                  type="text"
                  placeholder="Enter value"
                  value={descriptions[index].label}
                  onChange={evt => {
                    changeHandler('label', evt.target.value, selectedIndex)
                  }}
                  onFocus={() => {
                    setSelectedIndex(index)
                  }}
                />
              </div>
            </div>
            <div className="uk-margin-left uk-width-1-1">
              <FormLabel label="Value" />
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Enter value"
                  value={decodeHtml(descriptions[index].value)}
                  onChange={evt => {
                    changeHandler('value', evt.target.value, selectedIndex)
                  }}
                  onFocus={() => {
                    setSelectedIndex(index)
                  }}
                />
              </div>
            </div>
            <div className="uk-margin-left uk-width-1-6">
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
        ))}
        <div className="uk-margin">
          <Button
            type="button"
            className="uk-button uk-button-default"
            onClick={() => {
              setDescriptions([...descriptions, { label: '', value: '' }])
            }}
          >
            Add new field
          </Button>
        </div>
      </fieldset>
      <div className="uk-margin-top">
        {isUpdating ? (
          <div uk-spinner="ratio: 1" />
        ) : (
          <button className="uk-button uk-button-primary uk-align-center" type="submit">
            SAVE
          </button>
        )}
      </div>
    </form>
  )
}

export default CustomDescriptionForm
