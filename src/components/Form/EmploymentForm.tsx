import React, { ChangeEvent, useEffect, useState } from 'react'

import { TwoInputs } from '../Input'
import { FormLabel } from '../Label'

import Countries from '../../constants/Countries.json'
import { EmploymentHistory } from '../../interfaces/Profile'
import Profile from '../../models/Profile'
import '../Input/TwoInputs.css'
import { FormSelector } from '../Selector'
import './AddressForm.css'

interface Props {
  profile: Profile
  isEdit: boolean
  updateIndex: number
  isListing?: boolean
  handleProfileSave: () => void
}

const EmploymentForm = ({ profile, updateIndex, isEdit, handleProfileSave }: Props) => {
  const employmentHistory = profile.background!.employmentHistory
  const defaultObject = {
    company: '',
    position: '',
    description: '',
    location: {
      city: '',
      country: '',
    },
    period: {
      from: new Date(),
      to: new Date(),
    },
  } as EmploymentHistory

  const [isWorkingHere, setIsWorkingHere] = useState(false)
  const [employment, setEmployment] = useState(defaultObject)
  const [targetIndex, setTargetIndex] = useState(updateIndex)

  useEffect(() => {
    let target: EmploymentHistory

    if (isEdit) {
      target = employmentHistory[targetIndex]
      setTargetIndex(targetIndex)
    } else {
      employmentHistory.push(defaultObject)
      const currentIndex = employmentHistory.length - 1
      setTargetIndex(currentIndex)
      target = employmentHistory[currentIndex]
    }
    if (!target.period || !target.location) {
      target = defaultObject
    }
    if (target.period) {
      setIsWorkingHere(!target.period!.to)
    }
    setEmployment(target)
  }, [])

  const handleChange = (field, value) => {
    setEmployment({ ...employment, [field]: value } as EmploymentHistory)
  }

  return (
    <form
      className="uk-form-stacked uk-width-1-1"
      onSubmit={evt => {
        evt.preventDefault()
        profile.background!.employmentHistory[targetIndex] = employment
        handleProfileSave()
      }}
    >
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label="Company Name" required />
          <input
            className="uk-input"
            type="text"
            value={employment.company}
            placeholder="Company Name"
            required
            onChange={evt => {
              handleChange('company', evt.target.value)
            }}
          />
        </div>
        <div className="uk-margin">
          <FormLabel label="Position" required />
          <input
            className="uk-input"
            type="text"
            value={employment.position}
            placeholder="Position/Rank in the company"
            required
            onChange={evt => {
              handleChange('position', evt.target.value)
            }}
          />
        </div>
        <div className="uk-margin">
          <FormLabel label="Description" required />
          <textarea
            className="uk-textarea"
            rows={5}
            value={employment.description}
            placeholder="Tell us a bit about your work"
            required
            onChange={evt => {
              handleChange('description', evt.target.value)
            }}
          />
        </div>
        <div className="uk-margin">
          <label>
            <input
              className="uk-checkbox"
              type="checkbox"
              checked={isWorkingHere}
              onChange={evt => {
                if (evt.target.checked) {
                  delete employment.period!.to
                  handleChange('period', employment.period!)
                } else {
                  employment.period!.to = new Date()
                  handleChange('period', employment.period!)
                }
                setIsWorkingHere(evt.target.checked)
              }}
            />{' '}
            Currently working here?
          </label>
        </div>
        <TwoInputs
          input1={{
            label: 'Start Date',
            props: {
              type: 'date',
              required: true,
              value: employment.period!.from.toLocaleDateString('en-CA'),
              onChange: (evt: ChangeEvent<HTMLInputElement>) => {
                employment.period!.from = new Date(evt.target.value)
                handleChange('period', employment.period!)
              },
            },
            required: true,
          }}
          input2={{
            label: 'End Date',
            props: {
              type: 'date',
              value: !isWorkingHere ? employment.period!.to.toLocaleDateString('en-CA') : '',
              onChange: (evt: ChangeEvent<HTMLInputElement>) => {
                employment.period!.to = new Date(evt.target.value)
                handleChange('period', employment.period!)
              },
            },
            hidden: isWorkingHere,
          }}
        />
        <div className="uk-margin uk-flex uk-flex-row">
          <div className="uk-width-1-2 uk-margin-right">
            <FormLabel label="City" required />
            <input
              className="uk-input"
              value={employment.location.city}
              placeholder="City"
              required
              onChange={evt => {
                employment.location.city = evt.target.value
                handleChange('location', employment.location)
              }}
            />
          </div>
          <div className="uk-width-1-2">
            <FormLabel label="Country" required />
            <FormSelector
              options={Countries}
              defaultVal={employment.location.country || ''}
              onChange={evt => {
                employment.location.country = evt.target.value
                handleChange('country', employment.location)
              }}
              required
            />
          </div>
        </div>
      </fieldset>
      <div id="save-btn-div">
        {isEdit ? (
          <button
            className="uk-button uk-button-danger uk-margin-right"
            type="button"
            onClick={evt => {
              evt.preventDefault()
              employmentHistory.splice(updateIndex!, 1)
              handleProfileSave()
            }}
          >
            DELETE
          </button>
        ) : null}
        <button className="uk-button uk-button-primary" type="submit">
          SAVE
        </button>
      </div>
    </form>
  )
}

export default EmploymentForm
