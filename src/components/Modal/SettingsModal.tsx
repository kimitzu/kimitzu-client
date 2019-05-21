import React, { ReactNode, useState } from 'react'

import './SettingsModal.css'

interface Props {
  content: {
    component: ReactNode
    title: string
  }
  currentLinkIndex: number
  updateSettingsIndex: (event: React.FormEvent, index: number) => void
}

const SettingsModal = (props: Props) => {
  const { content, updateSettingsIndex, currentLinkIndex } = props
  const [selectedIndex, setIndex] = useState(0)
  const getListId = (index: number) => (selectedIndex === index ? 'selected' : 'not-selected')
  const getLinkId = (index: number) => (currentLinkIndex === index ? 'selected' : '')
  return (
    <div id="settings" uk-modal>
      <div id="settings-modal-dialog" className="uk-modal-dialog">
        <button className="uk-modal-close-default" type="button" data-uk-close />
        <div id="settings-body" className="uk-modal-body" data-uk-overflow-auto>
          <div id="settings-list" className="uk-card uk-card-default uk-card-body uk-width-1-2@s">
            <ul className="uk-nav-default" data-uk-nav>
              <li id="settings-list-title" className="uk-nav-header color-primary">
                SETTINGS
              </li>
              <li id={getListId(0)} className="uk-parent uk-open">
                <a className="list-item" onClick={() => setIndex(0)}>
                  Profile
                </a>
                <ul className="uk-nav-sub">
                  <li>
                    <a id={getLinkId(0)} onClick={e => updateSettingsIndex(e, 0)}>
                      General
                    </a>
                  </li>
                  <li>
                    <a id={getLinkId(1)} onClick={e => updateSettingsIndex(e, 1)}>
                      Social Media
                    </a>
                  </li>
                  <li>
                    <a id={getLinkId(2)} onClick={e => updateSettingsIndex(e, 2)}>
                      Education
                    </a>
                  </li>
                  <li>
                    <a id={getLinkId(3)} onClick={e => updateSettingsIndex(e, 3)}>
                      Work History
                    </a>
                  </li>
                  <li>
                    <a id={getLinkId(4)} onClick={e => updateSettingsIndex(e, 4)}>
                      Addresses
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div id="modal-content">
            <h4 id="content-title" className="color-primary">
              {content.title}
            </h4>
            <div id="settings-content">{content.component}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
