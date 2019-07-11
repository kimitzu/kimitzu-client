import React from 'react'

import './DropdownList.css'

interface Item {
  id: string
  title: string
  tags: string[]
  children?: Item[]
}

interface Props {
  items: Item[]
  listIndex: number
  show?: boolean
  dataUkDropdown?: string
  handleHoverItem?: (dropdownIndex: number, itemIndex: number) => void
  handlePointerLeave?: (dropdownIndex) => void
  handleItemSelect: (selectedItem: string) => void
}

const DropdownList = ({
  dataUkDropdown,
  listIndex,
  items,
  show,
  handleHoverItem,
  handlePointerLeave,
  handleItemSelect,
}: Props) => {
  return (
    <div
      style={{ height: '424px', width: '250px' }}
      className={`uk-dropdown uk-padding-small uk-margin-remove ${
        show ? 'dropdown-keep-open' : ''
      }`}
      data-uk-dropdown={dataUkDropdown}
      onPointerLeave={
        handlePointerLeave
          ? () => handlePointerLeave(listIndex)
          : () => {
              console.log('do nothing')
            }
      }
    >
      <ul className="uk-nav uk-dropdown-nav">
        {items.map((item: Item, index: number) => (
          <li
            key={item.id}
            onPointerEnter={
              item.children && handleHoverItem
                ? () => handleHoverItem(listIndex, index)
                : () => {
                    console.log('do nothing')
                  }
            }
            className="uk-flex uk-flex-row uk-flex-middle"
            onClick={() => {
              handleItemSelect(item.id)
            }}
          >
            <a style={{ whiteSpace: 'initial', width: '90%' }}>{item.title}</a>
            {item.children && item.children.length > 0 ? (
              <span className="uk-flex-1 uk-text-right" data-uk-icon="icon: triangle-right" />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DropdownList
