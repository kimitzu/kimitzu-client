import React from 'react'

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  defaultVal: string
}

const FormSelector = (props: Props) => (
  <select className="uk-select form-field-border color-primary">
    {props.options.map((option: Option) => (
      <option key={option.value} selected={props.defaultVal === option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
)

export default FormSelector
