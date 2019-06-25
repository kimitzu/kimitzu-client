import classNames from 'classnames'
import React, { InputHTMLAttributes, SelectHTMLAttributes, useEffect, useState } from 'react'

import './AutoCompleteSelect.css'

interface Props {
  options: Options[]
  defaultSelectorVal?: string
  inputProps?: InputHTMLAttributes<any>
  selectProps?: SelectHTMLAttributes<any>
  onChange?: (value: Options) => void
}

interface Options {
  label: string
  value: string
}

let searchResults: Options[] = []
let selectOptions: Options[] = []

const AutoCompleteSelect = ({
  defaultSelectorVal,
  inputProps,
  options,
  selectProps,
  onChange,
}: Props) => {
  const [inputValue, setInputValue] = useState('')
  const [code, setCode] = useState('')
  const [show, setShow] = useState(false)
  const [focused, setFocused] = useState(false)

  selectOptions = options

  function inputChange(e) {
    setInputValue(e.target.value)
    const query = e.target.value.toLowerCase()
    const len = query.length
    const res = selectOptions.filter(
      o =>
        o.label.toLowerCase().substring(0, len) === query ||
        o.value.substring(0, len) === Number(query).toString() ||
        o.label.toLowerCase().includes(query)
    )
    searchResults = res
    setShow(true)
  }

  const dropdownClass = classNames({
    'uk-box-shadow-medium': true,
    showDropdown: show,
  })

  function toggleDropdown() {
    if (show) {
      setShow(false)
    } else {
      setShow(true)
    }
  }

  function dropdownOnBlur(e) {
    setTimeout(() => {
      setShow(false)
    }, 500)
  }

  function selectValue(e) {
    const el = document.getElementById(e.target.id)
    if (el) {
      const el2 = el.getElementsByTagName('p')[0].innerHTML
      setInputValue(el2)
      setCode(e.target.id)
      if (onChange) {
        onChange({ label: el2, value: e.target.id.replace('~', '') })
      }
    }
    setShow(false)
  }

  function dropdownFocused(e) {
    setFocused(true)
  }

  return (
    <div id="input-selector">
      <input
        id="input"
        className="uk-input"
        onChange={inputChange}
        onBlur={dropdownOnBlur}
        value={inputValue}
        tabIndex={0}
      />
      <a id="arrow" data-uk-icon="icon: triangle-down" onClick={toggleDropdown} />
      <div id="option-container" className={dropdownClass} tabIndex={1}>
        <ul id="uloptions">
          {searchResults.map(op => (
            <li id={op.value} key={op.value} onClick={selectValue} onFocus={dropdownFocused}>
              <p className="untouch">{op.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AutoCompleteSelect
