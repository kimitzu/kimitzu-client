import React from 'react'

import 'spinkit/css/spinners/7-three-bounce.css'
import './DottedSpinner.css'

interface Props {
  color?: string
  children?: React.ReactElement
}

const DottedSpinner = ({ color, children }: Props) => {
  const style = color ? { backgroundColor: color } : {}
  return (
    <div>
      <div className="sk-three-bounce">
        <div style={style} className="sk-child sk-bounce1" />
        <div style={style} className="sk-child sk-bounce2" />
        <div style={style} className="sk-child sk-bounce3" />
      </div>
      <div>{children}</div>
    </div>
  )
}

export default DottedSpinner
