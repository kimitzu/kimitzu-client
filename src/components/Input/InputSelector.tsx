import React, { InputHTMLAttributes, SelectHTMLAttributes } from 'react'

import './InputSelector.css'

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  defaultSelectorVal?: string
  inputProps?: InputHTMLAttributes<any>
  selectProps?: SelectHTMLAttributes<any>
}

const InputSelector = ({ defaultSelectorVal, inputProps, options, selectProps }: Props) => (
  <div id="input-selector" className="uk-flex">
    <input id="input" className="uk-input" {...inputProps} />
    <select
      id="selector"
      defaultValue={defaultSelectorVal}
      className="uk-select color-primary"
      {...selectProps}
    >
      {options.map((option: Option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

export default InputSelector
