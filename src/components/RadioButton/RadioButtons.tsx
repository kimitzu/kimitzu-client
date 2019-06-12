import React, { MouseEvent } from 'react'

import './RadioButtons.css'

interface Option {
  label: string
  value: string | boolean
}

interface Props {
  selectedVal: string
  field: string
  parentField?: string
  handleOnChange: (field: string, value: any, parentField?: string) => void
  options: Option[]
}

const RadioButtons = (props: Props) => {
  const { selectedVal, handleOnChange, options, field, parentField } = props
  return (
    <div id="radio-btns" className="uk-form-controls uk-form-controls-text">
      {options.map((option: Option) => (
        <label id="radio-label" key={option.value.toString()}>
          <input
            id="radio-input"
            className="uk-radio"
            type="radio"
            checked={option.value.toString() === selectedVal}
            onClick={event => handleOnChange(field, option.value, parentField!)}
            name={option.value.toString()}
          />
          {option.label}
        </label>
      ))}
    </div>
  )
}

export default RadioButtons
