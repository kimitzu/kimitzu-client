import React, { useState } from 'react'

import './MenuSideNav.css'

interface NavItem {
  label: string
  handler?: () => {}
}

interface ParentNavItem extends NavItem {
  subItems?: NavItem[]
}

interface Props {
  title: string
  navItems: ParentNavItem[]
}

const MenuSideNav = ({ title, navItems }: Props) => {
  const [navIndex, setNavIndex] = useState(0)
  const [subNavIndex, setSubNavIndex] = useState(0)
  const getNavParentId = (index: number) => (navIndex === index ? 'selected' : 'not-selected')
  const getSubNavId = (index: number) => (subNavIndex === index ? 'selected' : '')
  const changeNavIndex = (index: number, handler?: () => {}) => {
    setNavIndex(index)
    if (handler) {
      handler()
    }
  }
  const changeSubNavIndex = (index: number, parentIndex: number, handler?: () => {}) => {
    setNavIndex(parentIndex)
    setSubNavIndex(index)
    if (handler) {
      handler()
    }
  }
  return (
    <ul className="uk-nav-default" data-uk-nav>
      <li id="nav-title" className="uk-nav-header color-primary">
        {title}
      </li>
      {navItems.map((parentItem: ParentNavItem, index: number) => (
        <li
          id={getNavParentId(index)}
          key={`${parentItem}${index}`}
          className={parentItem.subItems ? 'uk-parent' : ''}
        >
          <a className="list-item" onClick={() => changeNavIndex(index, parentItem.handler)}>
            {parentItem.label}
          </a>
          {parentItem.subItems ? (
            <ul className="uk-nav-sub">
              {parentItem.subItems.map((navItem: NavItem, subIndex: number) => (
                <li key={`${navItem.label}${subIndex}`}>
                  <a
                    id={getSubNavId(subIndex)}
                    onClick={() => changeSubNavIndex(subIndex, index, navItem.handler)}
                  >
                    {navItem.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

export default MenuSideNav
