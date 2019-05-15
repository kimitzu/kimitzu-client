import React, { useState } from 'react'

import { RegistrationForm } from '../Form'
import './SettingsModal.css'

const sampleLocation = {
  address1: 'Awesome house',
  address2: 'Brgy. Labuglabug',
  city: 'Avipa',
  country: 'Felipens',
  latitude: 1.292826,
  longitude: 276.1344,
  plusCode: '424E+',
  state: 'Ioliol',
  zipCode: '1005',
}

const contents = [
  {
    component: {},
    title: 'General',
  },
  {
    component: {},
    title: 'Addresses',
  },
]

const SettingsModal = () => {
  const [selectedIndex, setIndex] = useState(0)
  const getListId = (index: number) => (selectedIndex === index ? 'selected' : 'not-selected')
  return (
    <div id="settings" uk-modal>
      <div id="settings-modal-dialog" className="uk-modal-dialog">
        <button className="uk-modal-close-default" type="button" data-uk-close />
        <div id="settings-body" className="uk-modal-body">
          <div id="settings-list" className="uk-card uk-card-default uk-card-body uk-width-1-2@s">
            <ul className="uk-nav-default" data-uk-nav>
              <li id="settings-list-title" className="uk-nav-header color-primary">
                SETTINGS
              </li>
              <li id={getListId(0)}>
                <a className="list-item" onClick={() => setIndex(0)}>
                  General
                </a>
              </li>
              <li id={getListId(1)}>
                <a className="list-item" onClick={() => setIndex(1)}>
                  Addresses
                </a>
              </li>
            </ul>
          </div>
          <div id="modal-content">
            <h4 id="content-title" className="color-primary">
              {contents[selectedIndex].title}
            </h4>
            <RegistrationForm availableCountries={[]} availableCurrencies={[]} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
