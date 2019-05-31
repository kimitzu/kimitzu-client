import React from 'react'

import './NavBar.css'

interface NavBarProps {
  onQueryChange: (fieldName: string, value: string) => void
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void
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
      <a id="title-logo" className="uk-navbar-item uk-logo" href="/">
        DJALI
      </a>
    </div>
    <div id="navbar-center-item" className="uk-navbar-center">
      {isSearchBarShow ? (
        <form
          id="search-bar-form"
          className="uk-search uk-search-default"
          onSubmit={onSearchSubmit}
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
