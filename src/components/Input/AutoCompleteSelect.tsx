import classNames from 'classnames'
import React, {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react'

import './AutoCompleteSelect.css'

interface Props {
  options: Option[]
  defaultSelectorVal?: string
  inputProps?: InputHTMLAttributes<any>
  selectProps?: SelectHTMLAttributes<any>
  onChange?: (value: Option) => void
  id?: string
}

interface Option {
  label: string
  value: string
}

let selectOptions: Option[] = []
let debounce = 0

const AutoCompleteSelect = ({
  defaultSelectorVal,
  inputProps,
  options,
  selectProps,
  onChange,
  id,
}: Props) => {
  const [focused, setFocused] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [resultLimit, setResultLimit] = useState(20)
  const [searchID, setSearchID] = useState(Math.random().toString())
  const [searchMaxResultCount, setSearchMaxResultCount] = useState(0)
  const [searchResults, setSearchResults] = useState([] as Option[])
  const [show, setShow] = useState(false)
  const resultRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>

  /**
   * Trigger controls for `useEffect(() => {}, [inputValue])`
   * so that it only executes the search when ready.
   */
  const [didMount, setDidMount] = useState(false)

  useEffect(() => {
    selectOptions = options
    if (!defaultSelectorVal) {
      setResults(selectOptions)
      setSearchMaxResultCount(selectOptions.length)
    } else {
      const filterOption = selectOptions.find(s => s.value === defaultSelectorVal) as Option
      setInputValue(filterOption.label || defaultSelectorVal)
    }
    setDidMount(true)
  }, [])

  /**
   * Execute search when `inputValue` changes.
   */
  useEffect(() => {
    if (!didMount) {
      return
    }

    window.clearTimeout(debounce)
    const debounceMethod = window.setTimeout(() => {
      setResultLimit(20)
      executeSearch(true)
    }, 250)
    debounce = debounceMethod
  }, [inputValue])

  /**
   * Limit the search results as lagging will occur on 1000+ entries
   *
   * @param searchResultsFull - Options[]
   */
  function setResults(searchResultsFull: Option[]) {
    const clone = [...searchResultsFull] as Option[]
    clone.splice(resultLimit, searchResultsFull.length - resultLimit)
    setSearchResults(clone)
  }

  function executeSearch(newSearch: boolean) {
    const query = inputValue.toLowerCase()
    const len = query.length
    const res = selectOptions.filter(o => {
      return (
        new RegExp('\\b' + query + '.*', 'ig').test(o.label) ||
        o.value.substring(0, len) === Number(query).toString()
      )
    })
    setSearchMaxResultCount(res.length)
    setResults(res)
    setShow(true)
    if (newSearch) {
      setSearchID(Math.random().toString())
    }
  }

  function inputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
  }

  const dropdownClass = classNames({
    'uk-box-shadow-medium': true,
    showDropdown: show,
  })

  function toggleDropdown() {
    if (show) {
      setShow(false)
    } else {
      setSearchID(Math.random().toString())
      setDidMount(true)
      setShow(true)
    }
  }

  function dropdownOnBlur(e) {
    setTimeout(() => {
      setShow(false)
    }, 250)
  }

  function selectValue(e) {
    const el = document.getElementById(e.target.id)
    if (el) {
      const el2 = el.getElementsByTagName('p')[0].innerHTML
      setInputValue(el2)
      const code = e.target.id.split('autocomplete-')[1]
      if (onChange) {
        onChange({ label: el2, value: code })
      }
    }
    setShow(false)
    setDidMount(false)
  }

  function dropdownFocused(e) {
    setFocused(true)
  }

  function executeInfiniteScroll() {
    const MAX_SCROLL_HEIGHT = resultRef.current.scrollHeight - resultRef.current.clientHeight
    const MAX_SCROLL_HEIGHT_EXECUTE_EXTENSION = MAX_SCROLL_HEIGHT * 0.8

    if (
      resultRef.current.scrollTop >= MAX_SCROLL_HEIGHT_EXECUTE_EXTENSION &&
      resultLimit <= searchMaxResultCount + 10
    ) {
      setResultLimit(resultLimit + 10)
      executeSearch(false)
    }
  }

  return (
    <div id="input-selector">
      <input
        id={`${id}-autocomplete`}
        className="uk-input input"
        onChange={inputChange}
        onBlur={dropdownOnBlur}
        onFocus={toggleDropdown}
        value={inputValue}
        tabIndex={0}
        autoComplete="off"
      />
      <a id="arrow" data-uk-icon="icon: triangle-down" onClick={toggleDropdown} />
      <div
        id="option-container"
        className={dropdownClass}
        tabIndex={1}
        key={searchID}
        ref={resultRef}
        onScroll={executeInfiniteScroll}
      >
        <ul id="uloptions">
          {searchResults.map(op => (
            <li
              id={`${id}-autocomplete-${op.value}`}
              key={op.value}
              onClick={selectValue}
              onFocus={dropdownFocused}
            >
              <p className="untouch">{op.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AutoCompleteSelect
