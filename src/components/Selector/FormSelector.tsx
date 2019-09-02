import React from 'react'

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  defaultVal: string
  required?: boolean
  disabled?: boolean
  id?: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const FormSelector = ({ options, defaultVal, disabled, onChange, required, id }: Props) => (
  <select
    className="uk-select form-field-border color-primary"
    onChange={onChange}
    required={required || false}
    disabled={disabled}
    value={defaultVal}
    id={id}
  >
    {options ? (
      options.map((option: Option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))
    ) : (
      <option />
    )}
  </select>
)

export default FormSelector
