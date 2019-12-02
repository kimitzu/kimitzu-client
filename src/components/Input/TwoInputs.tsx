import React, { InputHTMLAttributes } from 'react'

import { FormLabel } from '../Label'
import FormSelector from '../Selector/FormSelector'
import './TwoInputs.css'

interface Input {
  label: string
  props: any
  hidden?: boolean
  required?: boolean
}

interface Props {
  input1: Input
  input2: Input
}

const TwoInputs = (props: Props) => {
  const { input1, input2 } = props
  return (
    <div id="two-inputs" className={`uk-child-width-1-2@s`} data-uk-grid>
      {input1.props.options ? (
        <div>
          <div id="input1" hidden={input1.hidden}>
            <FormLabel required={input1.required} label={input1.label} />
            <FormSelector
              id="input1"
              defaultVal={''}
              options={input1.props.options}
              onChange={input1.props.onChange}
              {...input1.props}
            />
          </div>
        </div>
      ) : (
        <div>
          <div id="input1" hidden={input1.hidden}>
            <FormLabel required={input1.required} label={input1.label} />
            <input className="uk-input" {...input1.props} />
          </div>
        </div>
      )}
      {input2.props.options ? (
        <div>
          <div id="input2" hidden={input2.hidden}>
            <FormLabel required={input1.required} label={input2.label} />
            <FormSelector
              id="input2"
              defaultVal={input2.props.value}
              options={input2.props.options}
              onChange={input2.props.onChange}
              {...input2.props}
            />
          </div>
        </div>
      ) : (
        <div>
          <div id="input2" hidden={input2.hidden}>
            <FormLabel required={input2.required} label={input2.label} />
            <input className="uk-input" {...input2.props} />
          </div>
        </div>
      )}
    </div>
  )
}

export default TwoInputs
