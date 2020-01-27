import { IonHeader, isPlatform } from '@ionic/react'
import isElectron from 'is-electron'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import packageInfo from '../../../package.json'
import Profile from '../../models/Profile'

import { localeInstance } from '../../i18n'

import Axios from 'axios'
import config from '../../config'
import './NavBar.css'

interface NavBarProps {
  isSearchBarShow: boolean
  profile: Profile
}

interface DaemonVersions {
  obDaemon: string
  kimitzuDaemon: string
}

const handleReload = (evt?) => {
  if (evt) {
    evt.preventDefault()
  }
  window.location.hash = '/'
  window.location.reload()
}

const NavBar = ({ isSearchBarShow, profile }: NavBarProps) => {
  const [displayLogout, setDisplayLogout] = useState(false)
  const [srchQuery, setsrchQuery] = useState('')
  const { navigationBar: navigationBarLocale } = localeInstance.get.localizations
  const [versions, setVersions] = useState({
    obDaemon: '...',
    kimitzuDaemon: '...',
  } as DaemonVersions)

  useEffect(() => {
    ;(async () => {
      const isAuthActivated = await Profile.isAuthenticationActivated()
      setDisplayLogout(isAuthActivated)

      const daemonVersionRequest = await Axios.get(`${config.kimitzuHost}/info/version`)
      setVersions(daemonVersionRequest.data)
    })()
  }, [])

  return (
    <IonHeader translate>
      <nav id="nav" className="uk-navbar-container" data-uk-navbar uk-navbar="mode: click">
        <div id="navbar-left-item" className="uk-navbar-left">
          <a className="uk-navbar-item uk-logo" onClick={handleReload} href="/#">
            <img
              id="logo-img"
              src={`./images/Logo/${isPlatform('mobile') ? 'square-white' : 'full-blue'}.png`}
              alt="Kimitzu Text Logo"
            />
          </a>
        </div>
        <div id="navbar-center-item" className="uk-navbar-center">
          {isSearchBarShow ? (
            <div
              className={`uk-flex uk-flex-row uk-flex-middle uk-flex-center uk-flex-1 ${
                !isPlatform('mobile') ? 'uk-padding' : ''
              } uk-padding-remove-vertical`}
            >
              <form
                className="uk-search uk-search-default uk-width-1-1"
                onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault()
                  const dmEvent = new CustomEvent('srchEvent', { detail: srchQuery })
                  window.dispatchEvent(dmEvent)
                }}
              >
                <a
                  href="/#"
                  className="uk-search-icon-flip color-primary"
                  uk-icon="icon: search"
                  data-uk-search-icon
                  onClick={event => {
                    event.preventDefault()
                    const dmEvent = new CustomEvent('srchEvent', { detail: srchQuery })
                    window.dispatchEvent(dmEvent)
                  }}
                >
                  {''}
                </a>
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
              <a href="/#" className="navbar-icon" onClick={evt => evt.preventDefault()}>
                <span className="uk-navbar-item uk-logo" data-uk-icon="icon: question" />
              </a>
              <div className="uk-navbar-dropdown" uk-dropdown="offset: 0; boundary: #nav">
                <ul className="uk-nav uk-navbar-dropdown-nav">
                  <li className="uk-text-emphasis">
                    <div>Versions:</div>
                    <div className="uk-margin-small-bottom">
                      <p>Client</p>
                      <p>v{packageInfo.version}</p>
                    </div>
                    <div className="uk-margin-small-bottom">
                      <p>Kimitzu Server</p>
                      <p>v{versions.kimitzuDaemon}</p>
                    </div>
                    <div className="uk-margin-small-bottom">
                      <p>OpenBazaar Server</p>
                      <p>v{versions.obDaemon}</p>
                    </div>
                  </li>
                  <li className="uk-nav-divider" />
                  <li className="uk-active">
                    <p>{navigationBarLocale.supportLabel1}</p>
                    <p>{navigationBarLocale.supportLabel2}</p>
                  </li>
                  <li>
                    {isElectron() ? (
                      <a
                        href="/#"
                        onClick={evt => {
                          evt.preventDefault()
                          window.openExternal(
                            'https://matrix.to/#/!xFlXJaVNhOkMvnpUgj:matrix.kimitzu.ch?via=matrix.kimitzu.ch'
                          )
                        }}
                      >
                        <span uk-icon="icon: comments" /> Matrix (Homeserver: matrix.kimitzu.ch)
                      </a>
                    ) : (
                      <a
                        href={
                          'https://matrix.to/#/!xFlXJaVNhOkMvnpUgj:matrix.kimitzu.ch?via=matrix.kimitzu.ch'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span uk-icon="icon: comments" /> Matrix (Homeserver: matrix.kimitzu.ch)
                      </a>
                    )}
                  </li>
                  <li>
                    {isElectron() ? (
                      <a
                        href="/#"
                        onClick={evt => {
                          evt.preventDefault()
                          window.openExternal('https://github.com/kimitzu/kimitzu-client')
                        }}
                      >
                        <span uk-icon="icon: github" /> Github
                      </a>
                    ) : (
                      <a
                        href={'https://github.com/kimitzu/kimitzu-client'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span uk-icon="icon: github" /> Github
                      </a>
                    )}
                  </li>
                </ul>
              </div>
            </li>
            {!isPlatform('mobile') ? (
              <li>
                <a
                  href="/#"
                  id="account"
                  className="navbar-icon"
                  onClick={evt => evt.preventDefault()}
                >
                  <span className="uk-navbar-item uk-logo" data-uk-icon="icon: user" />
                </a>
                <div className="uk-navbar-dropdown" uk-dropdown="offset: 0; boundary: #nav">
                  <ul className="uk-nav uk-dropdown-nav">
                    <li>
                      <Link id="create-new-listing" to="/listing/create">
                        {navigationBarLocale.createNewListingLabel}
                      </Link>
                    </li>
                    <li className="uk-nav-divider" />
                    <li>
                      <Link id="purchase-history" to="/history/purchases">
                        {navigationBarLocale.purchaseHistoryLabel}
                      </Link>
                    </li>
                    <li>
                      <Link id="sales-history" to="/history/sales">
                        {navigationBarLocale.salesHistoryLabel}
                      </Link>
                    </li>
                    <li hidden={!profile.moderator}>
                      <Link id="case-history" to="/history/cases">
                        {navigationBarLocale.caseHistoryLabel}
                      </Link>
                    </li>
                    <li className="uk-nav-divider" />
                    <li>
                      <Link id="view-profile" to="/profile">
                        {navigationBarLocale.profileLabel}
                      </Link>
                    </li>
                    <li>
                      <Link id="wallet" to="/wallet">
                        {navigationBarLocale.walletLabel}
                      </Link>
                    </li>
                    <li>
                      <Link id="settings" to="/settings">
                        {navigationBarLocale.settingsLabel}
                      </Link>
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
            ) : null}
          </ul>
        </div>
      </nav>
    </IonHeader>
  )
}

export default NavBar
