import React, { useEffect, useState } from 'react'
import useForceUpdate from 'use-force-update'

import DropdownList from './DropdownList'

interface Item {
  id?: string
  title: string
  tags?: string[]
  children?: Item[]
}

interface InlineMultiDropdownsProps {
  handleItemSelect: (itemValue: string, itemId?: string) => void
  title: string
  items: Item[]
  id: string
}

const InlineMultiDropdowns = ({
  handleItemSelect,
  title,
  items,
  id,
}: InlineMultiDropdownsProps) => {
  const forceUpdate = useForceUpdate()
  const [listItems, setListItems] = useState([items])
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([])
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [dropdownHeight, setDropdownHeight] = useState(0)
  const [dropdownWidth] = useState(225)

  const closeDropdown = () => {
    setFocusedIndex(-1)
    setSelectedIndexes([])
  }
  const handlePointerLeave = (dropdownIndex: number) => {
    if (focusedIndex + 1 === dropdownIndex) {
      closeDropdown()
      forceUpdate()
    }
  }
  const handleHoverItem = (dropdownIndex: number, itemIndex: number) => {
    const nextDropdownIndex = dropdownIndex + 1
    let indexes = selectedIndexes
    indexes[dropdownIndex] = itemIndex
    if (dropdownIndex < focusedIndex) {
      indexes = indexes.slice(0, dropdownIndex)
      setSelectedIndexes(indexes)
    }
    setFocusedIndex(dropdownIndex)
    const nextItems = listItems[dropdownIndex][itemIndex]
    listItems[nextDropdownIndex] =
      nextItems.children && nextItems.children.length > 0
        ? nextItems.children
        : nextItems.tags
        ? nextItems.tags.map(tag => {
            return { title: tag }
          })
        : []
    setListItems(listItems)
    forceUpdate()
  }
  useEffect(() => {
    window.onclick = e => {
      const multiDropdown = document.getElementById(`${id}-multi-dropdown`)
      const dropDownListItems = document.getElementById('dropdown-list-items')
      if (e.target !== multiDropdown || e.target !== dropDownListItems) {
        closeDropdown()
      }
    }
    if (dropdownHeight === 0) {
      const dropdownElem = document.getElementById(`${id}-dropdownlist`)
      if (dropdownElem && dropdownElem.children[1]) {
        setDropdownHeight(dropdownElem.children[1].clientHeight)
      }
    }
  })

  return (
    <ul className="uk-subnav uk-subnav-pill">
      <li id={`${id}-dropdownlist`}>
        <a
          href="/#"
          id={`${id}-multi-dropdown`}
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
            return focusedIndex !== -1 ? setFocusedIndex(-1) : setFocusedIndex(0)
          }}
        >
          {title}
          <span data-uk-icon="icon: triangle-down" />
        </a>
        {listItems.map((listItem, index) => {
          const height = index !== 0 ? `${dropdownHeight}px` : ''
          return listItem.length > 0 ? (
            <DropdownList
              id={id}
              key={`drop${index}`}
              style={{
                height,
                overflow: 'overlay',
                width: `${dropdownWidth}px`,
                left: `${20 + index * dropdownWidth}px`,
              }}
              selectedIndex={selectedIndexes[index]}
              dataUkDropdown={`${index === 0 ? 'mode: click' : 'pos: right-center'}`}
              listIndex={index}
              show={focusedIndex > -1 && index <= focusedIndex + 1}
              items={listItem}
              handlePointerLeave={handlePointerLeave}
              handleHoverItem={handleHoverItem}
              handleItemSelect={handleItemSelect}
              closeDropdown={closeDropdown}
            />
          ) : null
        })}
      </li>
    </ul>
  )
}

export default InlineMultiDropdowns
