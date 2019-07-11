import React, { useState } from 'react'
import useForceUpdate from 'use-force-update'

import ServiceCategories from '../../constants/ServiceCategories.json'

import DropdownList from './DropdownList'

interface Item {
  id: string
  title: string
  tags: string[]
  children?: Item[]
}

interface InlineMultiDropdownsProps {
  handleItemSelect: (selectedItem: string) => void
}

const InlineMultiDropdowns = ({ handleItemSelect }: InlineMultiDropdownsProps) => {
  const forceUpdate = useForceUpdate()
  const [listItems, setListItems] = useState<Item[][]>([ServiceCategories])
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [minHeight, setMinHeight] = useState('300px')

  const handlePointerLeave = (dropdownIndex: number) => {
    if (focusedIndex === dropdownIndex) {
      setFocusedIndex(-1)
      forceUpdate()
    }
  }
  const handleHoverItem = (dropdownIndex: number, itemIndex: number) => {
    const nextDropdownIndex = dropdownIndex + 1
    setFocusedIndex(nextDropdownIndex)
    listItems[nextDropdownIndex] = listItems[dropdownIndex][itemIndex].children || []
    setListItems(listItems)
    forceUpdate()
  }

  return (
    <ul className="uk-subnav uk-subnav-pill">
      <li>
        <a onClick={() => (focusedIndex !== -1 ? setFocusedIndex(-1) : setFocusedIndex(0))}>
          Classifications
          <span data-uk-icon="icon: triangle-down" />
        </a>
        {listItems.map((items, index) => (
          <DropdownList
            key={`drop${index}`}
            dataUkDropdown={`${
              index === 0 ? 'pos: bottom-center; mode: click' : 'pos: right-center'
            }`}
            listIndex={index}
            show={focusedIndex > -1 && index <= focusedIndex}
            items={items}
            handlePointerLeave={handlePointerLeave}
            handleHoverItem={handleHoverItem}
            handleItemSelect={handleItemSelect}
          />
        ))}
      </li>
    </ul>
  )
}

export default InlineMultiDropdowns
