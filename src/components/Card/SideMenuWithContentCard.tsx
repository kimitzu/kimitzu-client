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
  isLoading?: boolean
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
  isLoading,
}: Props) => {
  return (
    <div
      id="side-menu-with-content-card"
      className="uk-card uk-card-default uk-card-body uk-width-5-6@m uk-flex uk-margin-auto"
    >
      <div id="side-menu-card-nav" className="uk-card-default">
        <MenuSideNav
          navItems={menuContent.navItems}
          title={menuContent.title}
          currentNavIndex={currentNavIndex}
          currentSubNavIndex={currentSubNavIndex}
        />
      </div>
      <div id="side-menu-with-content-main">
        {showBackBtn ? (
          <a
            id="card-content-back-btn"
            className="color-primary"
            data-uk-icon="arrow-left"
            onClick={handleBackBtn}
          />
        ) : null}
        <h4 id="side-menu-with-content-card-title" className="color-primary">
          {mainContentTitle}
        </h4>
        {isLoading ? null : <div id="side-menu-with-content-card-component">{mainContent}</div>}
      </div>
    </div>
  )
}

export default SideMenuWithContentCard
