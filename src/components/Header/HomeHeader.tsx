import { Plugins } from '@capacitor/core'
import { IonButton, IonHeader, IonSearchbar, IonToolbar } from '@ionic/react'
import React, { useEffect, useState } from 'react'

import { localeInstance } from '../../i18n'

import './HomeHeader.css'

const { Keyboard } = Plugins

const HomeHeader = () => {
  const [query, setQuery] = useState<string>('')
  const [isKeyboardShown, setIsKeyboardShown] = useState<boolean>(false)
  const handleQueryChange = e => {
    setQuery(e.target.value)
  }
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const dmEvent = new CustomEvent('srchEvent', { detail: query })
    window.dispatchEvent(dmEvent)
  }
  const handleClearQuery = () => {
    setQuery('')
  }

  const handleShowKeyboard = () => {
    setIsKeyboardShown(true)
  }

  const handleHideKeyboard = () => {
    setIsKeyboardShown(false)
  }

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', handleShowKeyboard)
    Keyboard.addListener('keyboardWillHide', handleHideKeyboard)
  }, [])

  return (
    <IonHeader translate>
      <IonToolbar translate color="primary">
        <form
          onSubmit={handleSearchSubmit}
          className="uk-flex uk-flex-row uk-flex-center uk-flex-middle"
        >
          <IonSearchbar
            translate
            color="light"
            inputmode="search"
            onIonClear={handleClearQuery}
            onIonChange={handleQueryChange}
            placeholder={localeInstance.get.localizations.mobileHeader.searchPlaceholder}
          />
          <IonButton
            translate
            id="search-btn"
            color="primary"
            size="small"
            hidden={!isKeyboardShown}
            type="submit"
          >
            {localeInstance.get.localizations.mobileHeader.searchBtn.toUpperCase()}
          </IonButton>
        </form>
      </IonToolbar>
    </IonHeader>
  )
}

export default HomeHeader
