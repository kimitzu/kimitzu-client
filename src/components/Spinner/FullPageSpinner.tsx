import React from 'react'

import CircleSpinner from './CircleSpinner'

interface Props {
  message?: string
}

const FullPageSpinner = ({ message }: Props) => (
  <div className="full-vh uk-flex uk-flex-middle uk-flex-center">
    <CircleSpinner message={message} />
  </div>
)

export default FullPageSpinner
