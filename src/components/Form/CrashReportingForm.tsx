import isElectron from 'is-electron'
import React, { useEffect, useState } from 'react'

import { Button } from '../Button'

interface UserPreferences {
  enableCrashReporting: boolean
  [key: string]: any
}

const CrashReportingForm = () => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    enableCrashReporting: false,
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
  const handleChange = () => {
    setHasChanges(true)
    setUserPreferences(prevState => {
      prevState.enableCrashReporting = !prevState.enableCrashReporting
      return { ...prevState }
    })
  }
  const handleSave = () => {
    ipcRenderer.send('updateUserPreferences', userPreferences)
  }
  return (
    <div className="uk-form uk-margin uk-width-1-1">
      <div className="uk-flex uk-flex-column">
        <label>
          <input
            className="uk-checkbox"
            type="checkbox"
            checked={userPreferences.enableCrashReporting}
            onChange={handleChange}
          />{' '}
          Enable Crash Reporting
        </label>
        <label className="form-label-desciptor">Send crash reports to the developers</label>
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

export default CrashReportingForm
