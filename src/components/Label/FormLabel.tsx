import React from 'react'

interface Props {
  label: string
  required?: boolean
}

const FormLabel = (props: Props) => (
  <label className="uk-form-label color-primary">
    {props.required ? <label className="required">*</label> : null} {props.label}
  </label>
)

export default FormLabel
