import React, { useState } from 'react'

import { Button } from '../Button'
import { FormLabel } from '../Label'

import { localeInstance } from '../../i18n'

interface LoginProps {
  onSubmit: (username: string, password: string) => void
  submitLabel: string
}

const Login = ({ onSubmit, submitLabel }: LoginProps) => {
  const { localizations } = localeInstance.get
  const [isLoggingIn, setIslogginIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    setIslogginIn(true)
    await onSubmit(username, password)
    setIslogginIn(false)
  }
  return (
    <form
      className="uk-form-stacked uk-flex uk-flex-column uk-width-1-1"
      onSubmit={evt => {
        evt.preventDefault()
        handleLogin()
      }}
    >
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label={localizations.usernameLabel} required />
          <input
            className="uk-input"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="uk-margin">
          <FormLabel label={localizations.passwordLabel} required />
          <input
            className="uk-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      </fieldset>
      <div className="uk-flex uk-flex-center">
        <Button showSpinner={isLoggingIn} className="uk-button uk-button-primary" type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default Login
