import React, { useState } from 'react'
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

import { FormLabel } from '../Label'

import './TagsForm.css'

interface Props {
  tags: string[]
  handleContinue: () => void
  handleChange: () => void
}

const TagsForm = ({ tags, handleChange, handleContinue }: Props) => {
  return (
    <form className="uk-form-stacked">
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label="TAGS" required />
          <TagsInput value={tags} onChange={handleChange} />
          <label className="form-label-desciptor">Press "Enter" to add a tag</label>
        </div>
      </fieldset>
      <div className="submit-btn-div">
        <button className="uk-button uk-button-primary" onClick={handleContinue}>
          CONTINUE
        </button>
      </div>
    </form>
  )
}

export default TagsForm
