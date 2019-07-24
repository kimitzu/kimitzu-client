import React from 'react'

import { Link } from 'react-router-dom'
import './NavBar.css'

interface NavBarProps {
  onQueryChange: (fieldName: string, value: string, parentField?: string) => void
  onSearchSubmit: (isNewSearch: boolean) => void
  isSearchBarShow: boolean
}

const NavBar = ({ onQueryChange, onSearchSubmit, isSearchBarShow }: NavBarProps) => (
  <nav id="nav" className="uk-navbar-container" data-uk-navbar>
    <div id="navbar-left-item" className="uk-navbar-left">
      <a className="uk-navbar-item uk-logo" href="/">
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
              onClick={() => {
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
      <a id="account" className="uk-navbar-item uk-logo" data-uk-icon="icon: user" />
      <div className="uk-padding-small" data-uk-dropdown="pos: bottom-left; mode: click">
        <ul className="uk-nav uk-dropdown-nav">
          <li>
            <Link to="/settings/profile">
              <a>Settings</a>
            </Link>
          </li>
          <li>
            <Link to="/history/purchases">
              <a>Purchase History</a>
            </Link>
          </li>
          <li>
            <Link to="/history/sales">
              <a>Sales History</a>
            </Link>
          </li>
          <li>
            <Link to="/listing/create">
              <a>Create New Listing</a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
)

export default NavBar
