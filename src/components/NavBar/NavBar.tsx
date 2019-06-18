import React from 'react'

import { Link } from 'react-router-dom'
import './NavBar.css'

interface NavBarProps {
  onQueryChange: (fieldName: string, value: string) => void
  onSearchSubmit: (isNewSearch: boolean) => void
  handleSettings: () => void
  isSearchBarShow: boolean
}

const NavBar = ({
  onQueryChange,
  onSearchSubmit,
  handleSettings,
  isSearchBarShow,
}: NavBarProps) => (
  <nav id="nav" className="uk-navbar-container" data-uk-navbar>
    <div id="navbar-left-item" className="uk-navbar-left">
      <a className="uk-navbar-item uk-logo" href="/">
        <img id="logo-img" src="./images/Logo/White/SVG/Djali-White-Horizontal.svg" />
      </a>
    </div>
    <div id="navbar-center-item" className="uk-navbar-center">
      {isSearchBarShow ? (
        <div className="uk-flex uk-flex-row uk-flex-middle uk-flex-1">
          <form
            className="uk-search uk-search-default uk-width-1-1"
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault()
              onSearchSubmit(true)
            }}
          >
            <a
              href="/"
              className="uk-search-icon-flip color-primary"
              uk-icon="icon: search"
              data-uk-search-icon
            />
            <input
              id="search-bar"
              className="uk-search-input"
              type="search"
              placeholder="What are you looking for?"
              onChange={event => onQueryChange('searchQuery', event.target.value)}
            />
          </form>
          <div className="uk-width-1-2">
            <Link to="/listing/create">
              <a id="create-listing" className="uk-button uk-button-link uk-margin-left">
                <span uk-icon="plus-circle" /> Create Listing
              </a>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
    <div id="navbar-right-item" className="uk-navbar-right">
      <a
        id="account"
        className="uk-navbar-item uk-logo"
        data-uk-icon="icon: user"
        onClick={handleSettings}
      />
    </div>
  </nav>
)

export default NavBar
