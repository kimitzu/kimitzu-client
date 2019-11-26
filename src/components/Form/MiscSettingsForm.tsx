import isElectron from 'is-electron'
import React, { useEffect, useState } from 'react'

import { Button } from '../Button'

import { localeInstance } from '../../i18n'

interface UserPreferences {
  enableCrashReporting: boolean
  autoInstallUpdate: boolean
  [key: string]: any
}

const MiscSettingsForm = () => {
  const {
    localizations,
    localizations: {
      settingsPage: { miscForm },
    },
  } = localeInstance.get
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
      window.UIkit.notification(miscForm.saveSuccessNotif, { status: 'success' })
    } catch (error) {
      window.UIkit.notification(miscForm.saveErrorNotif, {
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
          {miscForm.crashReportLabel}
        </label>
        <label className="form-label-desciptor">{miscForm.crashReportHelper}</label>
      </div>
      <div className="uk-flex uk-flex-column uk-margin-top">
        <label>
          <input
            className="uk-checkbox"
            type="checkbox"
            checked={autoInstallUpdate}
            onChange={() => handleChange('autoInstallUpdate', !autoInstallUpdate)}
          />{' '}
          {miscForm.autoUpdatesLabel}
        </label>
        <label className="form-label-desciptor">{miscForm.autoUpdatesHelper}</label>
      </div>
      <div className="uk-margin-top">
        <Button
          className="uk-button uk-button-primary uk-align-center"
          hidden={!hasChanges}
          onClick={handleSave}
        >
          {localizations.saveBtnText}
        </Button>
      </div>
    </div>
  )
}

export default MiscSettingsForm
