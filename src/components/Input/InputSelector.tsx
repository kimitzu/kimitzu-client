import React, { InputHTMLAttributes, SelectHTMLAttributes } from 'react'

import './InputSelector.css'

interface Option {
  label: string
  value: string
}

interface Props {
  id?: string
  options: Option[]
  defaultSelectorVal?: string
  inputProps?: InputHTMLAttributes<any>
  selectProps?: SelectHTMLAttributes<any>
}

const InputSelector = ({ id, defaultSelectorVal, inputProps, options, selectProps }: Props) => (
  <div className="uk-flex input-selector-container">
    <input
      id={id ? `selector-input-${id}` : 'selector-input'}
      className="uk-input input-selector"
      {...inputProps}
    />
    <select
      id={`selector-${id}`}
      defaultValue={defaultSelectorVal}
      className="uk-select color-primary selector"
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
