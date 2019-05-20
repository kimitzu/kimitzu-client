import React, { InputHTMLAttributes } from 'react'

import { FormLabel } from '../Label'
import './TwoInputs.css'

interface Input {
  label: string
  props: InputHTMLAttributes<object>
  required?: boolean
}

interface Props {
  input1: Input
  input2: Input
}

const TwoInputs = (props: Props) => {
  const { input1, input2 } = props
  return (
    <div id="two-inputs">
      <div id="input1" className="uk-width-1-2@s">
        <FormLabel required={input1.required} label={input1.label} />
        <input className="uk-input" {...input1.props} />
      </div>
      <div id="input2" className="uk-width-1-2@s">
        <FormLabel required={input2.required} label={input2.label} />
        <input className="uk-input" {...input2.props} />
      </div>
    </div>
  )
}

export default TwoInputs
