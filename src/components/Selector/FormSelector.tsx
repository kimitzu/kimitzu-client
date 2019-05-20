import React from 'react'

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
}

const FormSelector = (props: Props) => (
  <select className="uk-select">
    {props.options.map((option: Option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
)

export default FormSelector
