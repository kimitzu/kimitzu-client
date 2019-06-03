import React, { InputHTMLAttributes, SelectHTMLAttributes } from 'react'

import './InputSelector.css'

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  defaultSelectorVal?: string
  inputProps?: InputHTMLAttributes<object>
  selectProps?: SelectHTMLAttributes<object>
}

const InputSelector = ({ defaultSelectorVal, inputProps, options, selectProps }: Props) => (
  <div id="input-selector" className="uk-flex">
    <input id="input" className="uk-input" {...inputProps} />
    <select id="selector" className="uk-select color-primary" {...selectProps}>
      {options.map((option: Option) => (
        <option
          key={option.value}
          value={option.value}
          selected={option.value === defaultSelectorVal}
        >
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

export default InputSelector
