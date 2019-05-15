import React from 'react'

import './NavBar.css'

interface Props {
  handleSettings: () => void
}

const NavBar = (props: Props) => (
  <nav id="nav" className="uk-navbar-container" data-uk-navbar>
    <div id="navbar-left-item" className="uk-navbar-left">
      <a id="title-logo" className="uk-navbar-item uk-logo" href="/">
        DJALI
      </a>
    </div>
    <div id="navbar-center-item" className="uk-navbar-center">
      <form id="search-bar-form" className="uk-search uk-search-default">
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
        />
      </form>
    </div>
    <div id="navbar-right-item" className="uk-navbar-right">
      <a
        id="account"
        className="uk-navbar-item uk-logo"
        href="#settings"
        data-uk-icon="icon: user"
        onClick={props.handleSettings}
      />
    </div>
  </nav>
)

export default NavBar
