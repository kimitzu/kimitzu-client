import React from 'react'

import './DottedSpinner.css'

interface Props {
  color?: string
}

const DottedSpinner = ({ color }: Props) => {
  const style = color ? { backgroundColor: color } : {}
  return (
    <div className="dotted-spinner">
      <div style={style} className="bounce1" />
      <div style={style} className="bounce2" />
      <div style={style} className="bounce3" />
    </div>
  )
}

export default DottedSpinner
