import React, { ReactNode } from 'react'

import { MenuSideNav } from '../Nav'

import './SideMenuWithContentCard.css'

// TODO: Move these interfaces if possible(duplicate interface with MenuSideNav.tsx)
interface SubNavItem {
  label: string
  handler?: () => void
}

interface NavItem extends SubNavItem {
  subItems?: SubNavItem[]
}

interface MenuNavContent {
  title: string
  navItems: NavItem[]
}

interface Props {
  menuContent: MenuNavContent
  mainContent: ReactNode
  mainContentTitle: string
  showBackBtn?: boolean
  handleBackBtn?: () => void
  currentNavIndex?: number
  currentSubNavIndex?: number
}

const SideMenuWithContentCard = ({
  handleBackBtn,
  mainContent,
  mainContentTitle,
  menuContent,
  showBackBtn,
  currentNavIndex,
  currentSubNavIndex,
}: Props) => {
  return (
    <div
      id="side-menu-with-content-card"
      className="uk-card uk-card-default uk-card-body uk-width-5-6@m uk-flex uk-margin-auto"
    >
      <div
        id="offcanvas-nav-primary"
        data-uk-offcanvas="overlay: true"
        onClick={e => window.UIkit.offcanvas(e.currentTarget).hide()}
      >
        <div className="uk-offcanvas-bar uk-flex uk-flex-column">
          <MenuSideNav
            id="mobile"
            navItems={menuContent.navItems}
            title={menuContent.title}
            currentNavIndex={currentNavIndex}
            currentSubNavIndex={currentSubNavIndex}
          />
        </div>
      </div>
      <div id="side-menu-card-nav" className="uk-card-default">
        <MenuSideNav
          id="desktop"
          navItems={menuContent.navItems}
          title={menuContent.title}
          currentNavIndex={currentNavIndex}
          currentSubNavIndex={currentSubNavIndex}
        />
      </div>
      <div id="side-menu-with-content-main">
        {showBackBtn ? (
          <a
            href="/#"
            id="card-content-back-btn"
            className="color-primary"
            data-uk-icon="arrow-left"
            onClick={handleBackBtn}
          >
            {''}
          </a>
        ) : null}
        <h4 id="side-menu-with-content-card-title" className="color-primary">
          <span
            id="button-menu-create-listing"
            uk-icon="icon: menu; ratio: 2"
            data-uk-toggle="target: #offcanvas-nav-primary"
          />
          {mainContentTitle}
          <span className="not-visible" uk-icon="icon: check; ratio: 2" />
        </h4>
        <div id="side-menu-with-content-card-component">{mainContent}</div>
      </div>
    </div>
  )
}

export default SideMenuWithContentCard
