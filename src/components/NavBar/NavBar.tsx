import { IonHeader } from '@ionic/react'
import isElectron from 'is-electron'
import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import Profile from '../../models/Profile'

import { localeInstance } from '../../i18n'
import './NavBar.css'

interface NavBarProps {
  isSearchBarShow: boolean
  profile: Profile
}

const handleReload = () => {
  window.location.hash = '/'
  window.location.reload()
}

const NavBar = ({ isSearchBarShow, profile }: NavBarProps) => {
  const [displayLogout, setDisplayLogout] = useState(false)
  const [srchQuery, setsrchQuery] = useState('')
  const { navigationBar: navigationBarLocale } = localeInstance.get.localizations

  useEffect(() => {
    ;(async () => {
      const isAuthActivated = await Profile.isAuthenticationActivated()
      setDisplayLogout(isAuthActivated)
    })()
  }, [])
  return (
    <IonHeader>
      <nav id="nav" className="uk-navbar-container" data-uk-navbar uk-navbar="mode: click">
        <div id="navbar-left-item" className="uk-navbar-left">
          <a className="uk-navbar-item uk-logo" onClick={handleReload}>
            <img id="logo-img" src="./images/Logo/full-blue.png" />
          </a>
        </div>
        <div id="navbar-center-item" className="uk-navbar-center">
          {isSearchBarShow ? (
            <div className="uk-flex uk-flex-row uk-flex-middle uk-flex-center uk-flex-1 uk-padding uk-padding-remove-vertical">
              <form
                className="uk-search uk-search-default uk-width-1-1"
                onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault()
                  const dmEvent = new CustomEvent('srchEvent', { detail: srchQuery })
                  window.dispatchEvent(dmEvent)
                }}
              >
                <a
                  href="#"
                  className="uk-search-icon-flip color-primary"
                  uk-icon="icon: search"
                  data-uk-search-icon
                  onClick={event => {
                    event.preventDefault()
                    const dmEvent = new CustomEvent('srchEvent', { detail: srchQuery })
                    window.dispatchEvent(dmEvent)
                  }}
                />
                <input
                  id="search-bar"
                  className="uk-search-input"
                  type="search"
                  placeholder={navigationBarLocale.searchPlaceholder}
                  onChange={event => {
                    setsrchQuery(event.target.value)
                  }}
                />
              </form>
            </div>
          ) : null}
        </div>
        <div className="uk-navbar-right">
          <ul className="uk-navbar-nav">
            <li>
              <a href="#" className="navbar-icon">
                <span className="uk-navbar-item uk-logo" data-uk-icon="icon: question" />
              </a>
              <div className="uk-navbar-dropdown" uk-dropdown="offset: 0; boundary: #nav">
                <ul className="uk-nav uk-navbar-dropdown-nav">
                  <li className="uk-active">
                    <p>{navigationBarLocale.supportLabel1}</p>
                    <p>{navigationBarLocale.supportLabel2}</p>
                  </li>
                  <li>
                    {isElectron() ? (
                      <a
                        href="#"
                        onClick={evt => {
                          evt.preventDefault()
                          window.openExternal(
                            'https://matrix.to/#/!xFlXJaVNhOkMvnpUgj:matrix.djali.org?via=matrix.djali.org'
                          )
                        }}
                      >
                        <span uk-icon="icon: comments" /> Matrix (Homeserver: matrix.djali.org)
                      </a>
                    ) : (
                      <a
                        href={
                          'https://matrix.to/#/!xFlXJaVNhOkMvnpUgj:matrix.djali.org?via=matrix.djali.org'
                        }
                        target="_blank"
                      >
                        <span uk-icon="icon: comments" /> Matrix (Homeserver: matrix.djali.org)
                      </a>
                    )}
                  </li>
                  <li>
                    {isElectron() ? (
                      <a
                        href="#"
                        onClick={evt => {
                          evt.preventDefault()
                          window.openExternal('https://github.com/djali-foundation/djali-client')
                        }}
                      >
                        <span uk-icon="icon: github" /> Github
                      </a>
                    ) : (
                      <a href={'https://github.com/djali-foundation/djali-client'} target="_blank">
                        <span uk-icon="icon: github" /> Github
                      </a>
                    )}
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <a href="#" id="account" className="navbar-icon">
                <span className="uk-navbar-item uk-logo" data-uk-icon="icon: user" />
              </a>
              <div className="uk-navbar-dropdown" uk-dropdown="offset: 0; boundary: #nav">
                <ul className="uk-nav uk-dropdown-nav">
                  <li id="create-new-listing">
                    <Link to="/listing/create">{navigationBarLocale.createNewListingLabel}</Link>
                  </li>
                  <li className="uk-nav-divider" />
                  <li id="purchase-history">
                    <Link to="/history/purchases">{navigationBarLocale.purchaseHistoryLabel}</Link>
                  </li>
                  <li id="sales-history">
                    <Link to="/history/sales">{navigationBarLocale.salesHistoryLabel}</Link>
                  </li>
                  <li hidden={!profile.moderator} id="case-history">
                    <Link to="/history/cases">{navigationBarLocale.caseHistoryLabel}</Link>
                  </li>
                  <li className="uk-nav-divider" />
                  <li id="view-profile">
                    <Link to="/profile">{navigationBarLocale.profileLabel}</Link>
                  </li>
                  <li id="wallet">
                    <Link to="/wallet">{navigationBarLocale.walletLabel}</Link>
                  </li>
                  <li id="settings">
                    <Link to="/settings">{navigationBarLocale.settingsLabel}</Link>
                  </li>
                  <li
                    hidden={!displayLogout}
                    onClick={() => {
                      Profile.logout()

                      if (isElectron()) {
                        const remote = window.remote
                        const currentWindow = remote.getCurrentWindow()
                        const { webContents } = currentWindow
                        webContents.clearHistory()
                      }
                      handleReload()
                    }}
                    id="logout"
                  >
                    <Link to="#">Logout</Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </IonHeader>
  )
}

export default NavBar
