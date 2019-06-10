import React from 'react'

import './RadioButtons.css'

interface Option {
  label: string
  value: string
}

interface Props {
  selectedVal: string
  handleOnChange: () => void
  options: Option[]
}

const RadioButtons = (props: Props) => {
  const { selectedVal, handleOnChange, options } = props
  return (
    <div id="radio-btns" className="uk-form-controls uk-form-controls-text">
      {options.map((option: Option) => (
        <label id="radio-label" key={option.value}>
          <input
            id="radio-input"
            className="uk-radio"
            type="radio"
            checked={option.value === selectedVal}
            onClick={handleOnChange}
            name={option.value}
          />
          {option.label}
        </label>
      ))}
    </div>
  )
}

export default RadioButtons
