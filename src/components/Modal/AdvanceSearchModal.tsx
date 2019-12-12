import { Multiselect } from 'multiselect-react-dropdown'
import React, { useEffect, useState } from 'react'

import Characteristics from '../../constants/PhysicalCharacteristics.json'
import { localeInstance } from '../../i18n/index'
import { searchInstance } from '../../models/Search'

const PhysicalCharacteristics = { ...Characteristics }
PhysicalCharacteristics[''] = { type: '', choices: [] }

interface InputRangeType {
  min: number
  max: number
}

type FieldType = 'selection' | 'number'

interface AdvanceSearchInterface {
  field: string
  type: FieldType
  selection: string[] | InputRangeType
}

const AdvanceSearchModal = ({ onSearchSubmit }) => {
  const [searchID, setSearchID] = useState('')
  const [filters, setFilters] = useState([] as AdvanceSearchInterface[])
  const locale = localeInstance.get.localizations

  useEffect(() => {
    handleAddCategory()
  }, [])

  function handleAddCategory() {
    const defaultEntry = Object.keys(PhysicalCharacteristics)[0]

    const filterClone = [
      ...filters,
      {
        field: defaultEntry,
        type: PhysicalCharacteristics[defaultEntry].type,
        selection: '',
      },
    ] as AdvanceSearchInterface[]
    setFilters(filterClone)
  }

  function handleCategoryChange(index, name) {
    const filterClone = [...filters]
    filterClone[index].field = name
    filterClone[index].selection = ['']
    const type = PhysicalCharacteristics[name].type
    filterClone[index].type = type
    if (type === 'selection') {
      filterClone[index].selection = []
    } else {
      filterClone[index].selection = { min: 0, max: 999999 }
    }
    setFilters(filterClone)
  }

  function handleSelect(fieldIndex, selection) {
    const filterClone = [...filters]
    filterClone[fieldIndex].selection = selection
    setFilters(filterClone)
  }

  function handleInput(fieldIndex, inputRangeType, value) {
    const filterClone = [...filters]
    let valueClone = Number(value)

    if (!filterClone[fieldIndex].selection) {
      filterClone[fieldIndex].selection = { min: 0, max: 999999 }
    }

    if (valueClone <= 0 || !valueClone) {
      if (inputRangeType === 'min') {
        valueClone = 0
      } else {
        valueClone = 999999
      }
    }

    filterClone[fieldIndex].selection[inputRangeType] = valueClone
    setFilters(filterClone)
  }

  function buildTemplate(fieldName, fieldValue) {
    return 'getPropAsString(doc.vendorID.peerID, "%fieldName%") == "%fieldValue%" && hasProp(doc.vendorID.peerID, "%fieldName%")'
      .replace(/%fieldName%/g, fieldName)
      .replace(/%fieldValue%/g, fieldValue)
  }

  async function executeSearch() {
    const parsedAdvancedSearchFilters = filters.map(filter => {
      if (filter.type === 'number') {
        filter.selection = filter.selection as InputRangeType
        const template =
          '(asInt(getPropAsString(doc.vendorID.peerID, "%fieldName%")) >= %min% && asInt(getPropAsString(doc.vendorID.peerID, "%fieldName%")) <= %max%) && hasProp(doc.vendorID.peerID, "%fieldName%")'
        return template
          .replace(/%fieldName%/g, filter.field)
          .replace(/%min%/g, filter.selection.min.toString())
          .replace(/%max%/g, filter.selection.max.toString())
      } else {
        filter.selection = filter.selection as string[]
        const filterStringBuilder = filter.selection.map(select => {
          return `(${buildTemplate(filter.field, select)})`
        })
        return filterStringBuilder.join(' || ')
      }
    })
    searchInstance.advancedSearch = parsedAdvancedSearchFilters
    onSearchSubmit()
  }

  function resetAdvancedFilters() {
    if (filters.length > 0) {
      setFilters([])
      searchInstance.advancedSearch = []
      setSearchID(Math.random().toString())
    }
  }

  function deleteFilter(filterIndex) {
    const filterClone = [...filters]
    filterClone.splice(filterIndex, 1)
    setFilters(filterClone)
  }

  useEffect(() => {
    if (filters.length < 1) {
      handleAddCategory()
    }
  }, [searchID])

  return (
    <div className="uk-container uk-flex uk-flex-center uk-flex-column">
      <div>
        <h2>{locale.advancedSearch}</h2>
      </div>
      <div className="uk-width-1-2@m uk-width-1-1@s uk-align-center" key={searchID}>
        {filters.map((filter, filterIndex) => {
          return (
            <div className="uk-grid uk-grid-small" data-uk-grid key={filterIndex}>
              <div className="uk-width-1-2">
                <select
                  className="uk-select"
                  onChange={evt => {
                    handleCategoryChange(filterIndex, evt.target.value)
                  }}
                  value={filter.field}
                >
                  {Object.keys(PhysicalCharacteristics).map(characteristic => {
                    return (
                      <option key={`${characteristic}`} value={characteristic}>
                        {characteristic}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className="uk-width-1-2 uk-flex uk-flex-row uk-flex-middle">
                {filter.type === 'number' ? (
                  <div className="uk-flex uk-flex-row uk-flex-middle">
                    <input
                      className="uk-input"
                      placeholder={locale.minimum}
                      onChange={evt => {
                        handleInput(filterIndex, 'min', evt.target.value)
                      }}
                    />
                    <input
                      className="uk-input"
                      placeholder={locale.maximum}
                      onChange={evt => {
                        handleInput(filterIndex, 'max', evt.target.value)
                      }}
                    />
                  </div>
                ) : (
                  <Multiselect
                    options={PhysicalCharacteristics[filter.field].choices}
                    displayValue="choices"
                    isObject={false}
                    selectedValues={[]}
                    onSelect={selection => {
                      handleSelect(filterIndex, selection)
                    }}
                  />
                )}
                <span
                  className="uk-margin-small-left cursor-pointer"
                  data-uk-icon="icon: trash"
                  onClick={() => {
                    deleteFilter(filterIndex)
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="uk-align-center uk-margin-top">
        <button className="uk-button uk-button-default" type="button" onClick={handleAddCategory}>
          Add Filter
        </button>
      </div>
      <div className="uk-align-center">
        <button className="uk-button uk-margin-right" type="reset" onClick={resetAdvancedFilters}>
          {locale.reset}
        </button>
        <button className="uk-button uk-button-primary" type="button" onClick={executeSearch}>
          {locale.search}
        </button>
      </div>
    </div>
  )
}

export default AdvanceSearchModal
