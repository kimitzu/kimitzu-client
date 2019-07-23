import React, { ButtonHTMLAttributes, useEffect, useState } from 'react'

import { DottedSpinner } from '../Spinner'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  showSpinner?: boolean
}

const Button = ({ showSpinner, ...props }: Props) => {
  const [btnWidth, setBtnWidth] = useState(0)
  const [btnHeight, setBtnHeight] = useState(0)
  useEffect(() => {
    const btn = document.getElementById('djali-btn')
    if ((!btnWidth || !btnHeight) && !showSpinner && btn) {
      setBtnWidth(btn.offsetWidth)
      setBtnHeight(btn.offsetHeight)
    }
  })
  return (
    <button
      id="djali-btn"
      style={showSpinner ? { width: `${btnWidth}px`, height: `${btnHeight}px` } : {}}
      {...props}
      disabled={showSpinner}
    >
      {showSpinner ? <DottedSpinner color="#fff" /> : props.children}
    </button>
  )
}

export default Button
