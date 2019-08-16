import React from 'react'

import 'spinkit/css/spinners/7-three-bounce.css'
import './DottedSpinner.css'

interface Props {
  color?: string
}

const DottedSpinner = ({ color }: Props) => {
  const style = color ? { backgroundColor: color } : {}
  return (
    <div className="sk-three-bounce">
      <div style={style} className="sk-child sk-bounce1" />
      <div style={style} className="sk-child sk-bounce2" />
      <div style={style} className="sk-child sk-bounce3" />
    </div>
  )
}

export default DottedSpinner
