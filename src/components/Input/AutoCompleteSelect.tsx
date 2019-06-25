import classNames from 'classnames'
import React, { InputHTMLAttributes, SelectHTMLAttributes, useEffect, useState } from 'react'

import './AutoCompleteSelect.css'

interface Props {
  options: string
  defaultSelectorVal?: string
  inputProps?: InputHTMLAttributes<any>
  selectProps?: SelectHTMLAttributes<any>
  onChange: (value: Options) => void
}

interface Options {
  value: string
  code: string
}

let searchResults: Options[] = []
const selectOptions: any[] = []
let trigerred = true

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

  const serviceObj = JSON.parse(options)

  useEffect(() => {
    if (trigerred) {
      trigerred = false
      Object.keys(serviceObj).map(key => {
        selectOptions.push({ value: serviceObj[key], code: key })
      })
    }
  })

  async function inputChange(e) {
    setInputValue(e.target.value)
    const query = e.target.value.toLowerCase()
    const len = query.length
    const res = selectOptions.filter(
      o =>
        o.value.toLowerCase().substring(0, len) === query ||
        o.code.substring(0, len) === Number(query).toString() ||
        o.value.toLowerCase().includes(query)
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
    console.log(selectOptions)
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
      onChange({ value: el2, code: e.target.id })
    }
    setShow(false)
  }

  function dropdownFocused(e) {
    console.log(true)
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
            <li id={op.code} key={op.code} onClick={selectValue} onFocus={dropdownFocused}>
              <p className="untouch">{op.value}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AutoCompleteSelect
