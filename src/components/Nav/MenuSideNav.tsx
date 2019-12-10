import React, { useEffect, useState } from 'react'

import './MenuSideNav.css'

// TODO: Move these interfaces if possible(duplicate interface with ListingAddUpdateCard.tsx)
interface SubNavItem {
  label: string
  handler?: () => void
}

interface NavItem extends SubNavItem {
  subItems?: SubNavItem[]
}

interface Props {
  title: string
  navItems: NavItem[]
  currentNavIndex?: number
  currentSubNavIndex?: number
  id?: string
}

const MenuSideNav = ({ title, navItems, currentNavIndex, currentSubNavIndex, id }: Props) => {
  const [navIndex, setNavIndex] = useState(0)
  const [subNavIndex, setSubNavIndex] = useState(0)
  useEffect(() => {
    if (currentNavIndex) {
      setNavIndex(currentNavIndex)
    }
    if (currentSubNavIndex) {
      setSubNavIndex(currentSubNavIndex)
    }
  })
  const getNavId = (index: number) => (navIndex === index ? 'selected' : 'not-selected')
  const getSubNavId = (index: number) => (subNavIndex === index ? 'selected' : '')
  const changeNavIndex = (index: number, handler?: () => void) => {
    setNavIndex(index)
    setSubNavIndex(0)
    if (handler) {
      handler()
    }
  }
  const changeSubNavIndex = (index: number, parentIndex: number, handler?: () => void) => {
    setNavIndex(parentIndex)
    setSubNavIndex(index)
    if (handler) {
      handler()
    }
  }
  return (
    <ul id="menu-side-nav" className="uk-nav-default" data-uk-nav>
      <li id="nav-title" className="uk-nav-header color-primary">
        {title}
      </li>
      {navItems.map((parentItem: NavItem, index: number) => (
        <li
          id={getNavId(index)}
          key={`${parentItem}${index}`}
          className={parentItem.subItems ? 'uk-parent uk-open' : ''}
        >
          <ul>
            <li
              className="uk-padding uk-padding-remove-vertical uk-uk-padding-remove-right"
              id={`${id}-${parentItem.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <a
                className="list-item"
                onClick={evt => {
                  evt.preventDefault()
                  changeNavIndex(index, parentItem.handler)
                }}
                href="/#"
              >
                {parentItem.label}
              </a>
            </li>
            <li hidden={navIndex !== index}>
              {parentItem.subItems ? (
                <ul className="uk-nav-sub">
                  {parentItem.subItems.map((navItem: NavItem, subIndex: number) => (
                    <li
                      key={`${navItem.label}${subIndex}`}
                      id={`${id}-${navItem.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <a
                        id={getSubNavId(subIndex)}
                        onClick={evt => {
                          evt.preventDefault()
                          changeSubNavIndex(subIndex, index, navItem.handler)
                        }}
                        href="/#"
                      >
                        {navItem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          </ul>
        </li>
      ))}
    </ul>
  )
}

export default MenuSideNav
