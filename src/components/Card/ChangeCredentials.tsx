import React, { useEffect, useState } from 'react'

import { localeInstance } from '../../i18n'
import Profile from '../../models/Profile'
import { Button } from '../Button'
import { FormLabel } from '../Label'

interface ChangeCredentialsProps {
  onSubmit: (oldUsername: string, oldPassword: string, username: string, password: string) => void
}

const ChangeCredentials = ({ onSubmit }: ChangeCredentialsProps) => {
  const {
    localizations: { settingsPage },
  } = localeInstance.get
  const [isLoggingIn, setIslogginIn] = useState(false)
  const [isAuthenticationActivated, setIsAuthenticationActivated] = useState(false)

  const [oldUsername, setOldUsername] = useState('')
  const [oldPassword, setOldPassword] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    setIslogginIn(true)
    await onSubmit(oldUsername, oldPassword, username, password)
    setIslogginIn(false)
  }

  useEffect(() => {
    ;(async () => {
      const isActivated = await Profile.isAuthenticationActivated()
      setIsAuthenticationActivated(isActivated)
    })()
  }, [])

  return (
    <form
      className="uk-form-stacked uk-flex uk-flex-column uk-width-1-1"
      onSubmit={evt => {
        evt.preventDefault()
        handleLogin()
      }}
    >
      <fieldset className="uk-fieldset">
        {isAuthenticationActivated ? (
          <>
            <div className="uk-margin">
              <FormLabel label={settingsPage.oldUsernameLabel} required />
              <input
                className="uk-input"
                type="text"
                value={oldUsername}
                onChange={e => setOldUsername(e.target.value)}
              />
            </div>
            <div className="uk-margin">
              <FormLabel label={settingsPage.oldPasswordLabel} required />
              <input
                className="uk-input"
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
              />
            </div>
            <hr />
          </>
        ) : null}
        <div className="uk-margin">
          <FormLabel label={settingsPage.newUsernameLabel} required />
          <input
            className="uk-input"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="uk-margin">
          <FormLabel label={settingsPage.newPasswordLabel} required />
          <input
            className="uk-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      </fieldset>
      <div className="uk-flex uk-flex-center uk-flex-column">
        <Button showSpinner={isLoggingIn} className="uk-button uk-button-primary" type="submit">
          {isAuthenticationActivated
            ? settingsPage.changeCredentialsBtnText
            : settingsPage.activateAuthenticationBtnText}
        </Button>
      </div>
    </form>
  )
}

export default ChangeCredentials
