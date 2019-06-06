import React, { ReactNode } from 'react'

import { MenuSideNav } from '../Nav'

import './ListingAddUpdateCard.css'

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
}

const ListingAddUpdateCard = ({ mainContent, menuContent, mainContentTitle }: Props) => (
  <div
    id="add-update-listing-card"
    className="uk-card uk-card-default uk-card-body uk-width-5-6@m uk-flex uk-margin-auto"
  >
    <div id="add-update-listing-card-nav" className="uk-card-default">
      <MenuSideNav navItems={menuContent.navItems} title={menuContent.title} />
    </div>
    <div id="add-update-listing-card-content">
      <h4 id="add-update-listing-content-title" className="color-primary">
        {mainContentTitle}
      </h4>
      <div id="add-update-listing-card-content-component">{mainContent}</div>
    </div>
  </div>
)

export default ListingAddUpdateCard
