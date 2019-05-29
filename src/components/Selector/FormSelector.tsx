import React from 'react'

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  defaultVal: string
  required?: boolean
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const FormSelector = (props: Props) => (
  <select
    className="uk-select form-field-border color-primary"
    onChange={props.onChange}
    required={props.required || false}
  >
    {props.options ? (
      props.options.map((option: Option) => (
        <option
          key={option.value}
          selected={props.defaultVal === option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))
    ) : (
      <option />
    )}
  </select>
)

export default FormSelector
