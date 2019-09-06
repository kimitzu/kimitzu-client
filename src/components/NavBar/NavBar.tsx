import isElectron from 'is-electron'
import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import Profile from '../../models/Profile'

import './NavBar.css'

interface NavBarProps {
  onQueryChange: (fieldName: string, value: string, parentField?: string) => void
  onSearchSubmit: (isNewSearch: boolean) => void
  isSearchBarShow: boolean
  profile: Profile
}

const handleReload = () => {
  window.location.hash = '/'
  window.location.reload()
}

const NavBar = ({ onQueryChange, onSearchSubmit, isSearchBarShow, profile }: NavBarProps) => {
  const [displayLogout, setDisplayLogout] = useState(false)
  useEffect(() => {
    ;(async () => {
      const isAuthActivated = await Profile.isAuthenticationActivated()
      setDisplayLogout(isAuthActivated)
    })()
  }, [])
  return (
    <nav id="nav" className="uk-navbar-container" data-uk-navbar>
      <div id="navbar-left-item" className="uk-navbar-left">
        <a className="uk-navbar-item uk-logo" onClick={handleReload}>
          <img id="logo-img" src="./images/Logo/White/SVG/Djali-White-Horizontal.svg" />
        </a>
      </div>
      <div id="navbar-center-item" className="uk-navbar-center">
        {isSearchBarShow ? (
          <div className="uk-flex uk-flex-row uk-flex-middle uk-flex-center uk-flex-1 uk-padding uk-padding-remove-vertical">
            <form
              className="uk-search uk-search-default uk-width-1-1"
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault()
                onSearchSubmit(true)
              }}
            >
              <a
                href="#"
                className="uk-search-icon-flip color-primary"
                uk-icon="icon: search"
                data-uk-search-icon
                onClick={event => {
                  event.preventDefault()
                  onSearchSubmit(true)
                }}
              />
              <input
                id="search-bar"
                className="uk-search-input"
                type="search"
                placeholder="What are you looking for?"
                onChange={event => onQueryChange('query', event.target.value, 'search')}
              />
            </form>
          </div>
        ) : null}
      </div>
      <div id="navbar-right-item" className="uk-navbar-right">
        <div id="account" className="uk-navbar-item uk-logo" data-uk-icon="icon: user" />
        <div className="uk-padding-small" data-uk-dropdown="pos: bottom-left; mode: click">
          <ul className="uk-nav uk-dropdown-nav">
            <li>
              <Link to="/listing/create">Create New Listing</Link>
            </li>
            <hr />
            <li>
              <Link to="/history/purchases">Purchase History</Link>
            </li>
            <li>
              <Link to="/history/sales">Sales History</Link>
            </li>
            <li hidden={!profile.moderator}>
              <Link to="/history/cases">Case History</Link>
            </li>
            <hr />
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/wallet">Wallet</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
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
            >
              <Link to="#">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
