import isElectron from 'is-electron'
import React, { useEffect, useState } from 'react'

import { Button } from '../Button'

interface UserPreferences {
  enableCrashReporting: boolean
  autoInstallUpdate: boolean
  [key: string]: any
}

const MiscSettingsForm = () => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    enableCrashReporting: false,
    autoInstallUpdate: false,
  })
  const [hasChanges, setHasChanges] = useState<boolean>(false)
  useEffect(() => {
    if (isElectron()) {
      ipcRenderer.send('requestUserPreferences')
      ipcRenderer.once(
        'userPreferences',
        (e, data) => {
          setUserPreferences(data)
        },
        []
      )
    }
  }, [])
  if (!isElectron()) {
    return null
  }
  const electron = window.require('electron')
  const { ipcRenderer } = electron
  const handleChange = (fieldName: string, value: any) => {
    setHasChanges(true)
    setUserPreferences(prevState => {
      prevState[fieldName] = value
      return { ...prevState }
    })
  }
  const handleSave = () => {
    try {
      ipcRenderer.send('updateUserPreferences', userPreferences)
      setHasChanges(false)
      window.UIkit.notification('Settings successfully updated', { status: 'success' })
    } catch (error) {
      window.UIkit.notification('Something went wrong. Please try again later', {
        status: 'danger',
      })
    }
  }
  const { autoInstallUpdate, enableCrashReporting } = userPreferences
  return (
    <div className="uk-form uk-margin uk-width-1-1">
      <div className="uk-flex uk-flex-column">
        <label>
          <input
            className="uk-checkbox"
            type="checkbox"
            checked={enableCrashReporting}
            onChange={() => handleChange('enableCrashReporting', !enableCrashReporting)}
          />{' '}
          Enable Crash Reporting
        </label>
        <label className="form-label-desciptor">Send crash reports to the developers</label>
      </div>
      <div className="uk-flex uk-flex-column uk-margin-top">
        <label>
          <input
            className="uk-checkbox"
            type="checkbox"
            checked={autoInstallUpdate}
            onChange={() => handleChange('autoInstallUpdate', !autoInstallUpdate)}
          />{' '}
          Auto install updates
        </label>
        <label className="form-label-desciptor">
          Updates will be downloaded and installed automatically
        </label>
      </div>
      <div className="uk-margin-top">
        <Button
          className="uk-button uk-button-primary uk-align-center"
          hidden={!hasChanges}
          onClick={handleSave}
        >
          SAVE
        </Button>
      </div>
    </div>
  )
}

export default MiscSettingsForm
