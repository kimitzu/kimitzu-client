import React, { ReactNode, useEffect, useState } from 'react'

import { FormLabel } from '../Label'

import './InlineFormFields.css'

interface Field {
  component: ReactNode
  label?: {
    name: string
    required?: boolean
  }
  descriptiveLabel?: string
}

interface Props {
  fields: Field[]
  sideOptions?: ReactNode[]
  alwaysShowSideOptions?: boolean
}

const InlineFormFields = ({ fields, sideOptions, alwaysShowSideOptions }: Props) => {
  const numberOfFields = fields.length
  const [showSideOptions, setShowSideOptions] = useState(true)
  const [sideDivWidth, setSideDivWidth] = useState('0px')
  const [hasLabels, setHasLabels] = useState(false)
  useEffect(() => {
    const elem = document.getElementById('side-options')
    if (elem) {
      setSideDivWidth(`${elem.offsetWidth}px`)
    }
    const doesLabelsExist = fields.some((field: Field) => field.label !== undefined)
    setHasLabels(doesLabelsExist)
  })
  return (
    <div
      id="multi-fields"
      className="uk-margin uk-flex"
      onMouseEnter={
        !alwaysShowSideOptions
          ? () => setShowSideOptions(true)
          : () => {
              /* */
            }
      }
      onMouseLeave={
        !alwaysShowSideOptions
          ? () => setShowSideOptions(false)
          : () => {
              /**/
            }
      }
    >
      {fields.map((field: Field, index: number) => (
        <div key={index.toString()} id="field" className={`uk-width-1-${numberOfFields}@s`}>
          {field.label ? (
            <div id={field.label.name}>
              <FormLabel required={field.label.required} label={field.label.name} />
            </div>
          ) : null}
          {field.component}
          {field.descriptiveLabel ? (
            <label className="form-label-desciptor">{field.descriptiveLabel}</label>
          ) : null}
        </div>
      ))}
      {sideOptions && showSideOptions ? (
        <div style={{ paddingTop: hasLabels ? '25px' : '0px' }} id="side-options">
          {sideOptions}
        </div>
      ) : (
        <div style={{ width: sideDivWidth }} hidden={showSideOptions} />
      )}
    </div>
  )
}

export default InlineFormFields
