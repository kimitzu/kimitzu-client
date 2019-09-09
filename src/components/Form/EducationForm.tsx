import React, { ChangeEvent, useEffect, useState } from 'react'

import { TwoInputs } from '../Input'
import { FormLabel } from '../Label'

import Countries from '../../constants/Countries.json'
import { EducationHistory } from '../../interfaces/Profile'
import Profile from '../../models/Profile'
import decodeHtml from '../../utils/Unescape'
import { FormSelector } from '../Selector'

import '../Input/TwoInputs.css'
import './AddressForm.css'

interface Props {
  profile: Profile
  isEdit: boolean
  updateIndex: number
  isListing?: boolean
  handleProfileSave: () => void
}

const EducationForm = ({ profile, updateIndex, isEdit, handleProfileSave }: Props) => {
  const educationHistory = profile.background!.educationHistory
  const defaultObject = {
    institution: '',
    degree: '',
    description: '',
    location: {
      city: '',
      country: '',
    },
    period: {
      from: new Date(),
      to: new Date(),
    },
  } as EducationHistory

  const [isStudyingHere, setIsStudyingHere] = useState(false)
  const [education, setEducation] = useState(defaultObject)
  const [targetIndex, setTargetIndex] = useState(updateIndex)

  useEffect(() => {
    let target: EducationHistory

    if (isEdit) {
      target = educationHistory[targetIndex]
      setTargetIndex(targetIndex)
    } else {
      educationHistory.push(defaultObject)
      const currentIndex = educationHistory.length - 1
      setTargetIndex(currentIndex)
      target = educationHistory[currentIndex]
    }
    if (!target.period || !target.location) {
      target = defaultObject
    }
    if (target.period) {
      setIsStudyingHere(!target.period!.to)
    }
    setEducation(target)
  }, [])

  const handleChange = (field, value) => {
    setEducation({ ...education, [field]: value } as EducationHistory)
  }

  return (
    <form
      className="uk-form-stacked uk-width-1-1"
      onSubmit={evt => {
        evt.preventDefault()
        profile.background!.educationHistory[targetIndex] = education
        handleProfileSave()
      }}
    >
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label="Institution Name" required />
          <input
            className="uk-input"
            type="text"
            value={decodeHtml(education.institution)}
            placeholder="Institution or School Name"
            required
            onChange={evt => {
              handleChange('institution', evt.target.value)
            }}
          />
        </div>
        <div className="uk-margin">
          <FormLabel label="Degree" required />
          <input
            className="uk-input"
            type="text"
            value={decodeHtml(education.degree)}
            placeholder="Degree, Specialization, Major"
            required
            onChange={evt => {
              handleChange('degree', evt.target.value)
            }}
          />
        </div>
        <div className="uk-margin">
          <FormLabel label="Description" required />
          <textarea
            className="uk-textarea"
            rows={5}
            value={decodeHtml(education.description)}
            placeholder="Tell us a bit about your degree and specialization"
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
              checked={isStudyingHere}
              onChange={evt => {
                if (evt.target.checked) {
                  delete education.period!.to
                  handleChange('period', education.period!)
                } else {
                  education.period!.to = new Date()
                  handleChange('period', education.period!)
                }
                setIsStudyingHere(evt.target.checked)
              }}
            />{' '}
            Currently studying here?
          </label>
        </div>
        <TwoInputs
          input1={{
            label: 'Start Date',
            props: {
              type: 'date',
              required: true,
              value: education.period!.from.toLocaleDateString('en-CA'),
              onChange: (evt: ChangeEvent<HTMLInputElement>) => {
                education.period!.from = new Date(evt.target.value)
                handleChange('period', education.period!)
              },
            },
            required: true,
          }}
          input2={{
            label: 'End Date',
            props: {
              type: 'date',
              value: !isStudyingHere ? education.period!.to.toLocaleDateString('en-CA') : '',
              onChange: (evt: ChangeEvent<HTMLInputElement>) => {
                education.period!.to = new Date(evt.target.value)
                handleChange('period', education.period!)
              },
            },
            hidden: isStudyingHere,
          }}
        />
        <div className="uk-margin uk-flex uk-flex-row">
          <div className="uk-width-1-2 uk-margin-right">
            <FormLabel label="City" required />
            <input
              className="uk-input"
              value={decodeHtml(education.location.city)}
              placeholder="City"
              required
              onChange={evt => {
                education.location.city = evt.target.value
                handleChange('location', education.location)
              }}
            />
          </div>
          <div className="uk-width-1-2">
            <FormLabel label="Country" required />
            <FormSelector
              options={Countries}
              defaultVal={education.location.country || ''}
              onChange={evt => {
                education.location.country = evt.target.value
                handleChange('country', education.location)
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
              educationHistory.splice(updateIndex!, 1)
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

export default EducationForm
