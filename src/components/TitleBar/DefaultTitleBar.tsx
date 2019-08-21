import React, { useState } from 'react'

import './DefaultTitleBar.css'

const DefaultTitleBar = () => {
  const remote = window.remote
  const currentWindow = remote.getCurrentWindow()
  const { webContents } = currentWindow
  const [[width, height]] = useState(currentWindow.getSize())
  const [isMaximize, setIsMaximize] = useState(false)
  return (
    <div id="title-cont">
      <div id="control-cont">
        <a
          id={!webContents.canGoBack() ? 'disable-icon-arrow' : ''}
          className="icon-arrows"
          onClick={() => {
            webContents.goBack()
          }}
          data-uk-icon="icon: chevron-left; ratio: 1.5"
        />
        <a
          id={!webContents.canGoForward() ? 'disable-icon-arrow' : ''}
          className="icon-arrows"
          onClick={() => {
            webContents.goForward()
          }}
          data-uk-icon="icon: chevron-right; ratio: 1.5"
        />
        <a
          className="icon-ref"
          onClick={() => {
            webContents.reload()
          }}
          data-uk-icon="icon: refresh; ratio: 1.2"
        />
      </div>
      <div id="url-cont">
        <input id="url-input" onChange={() => console.log('Feature not yet implemented')} />
      </div>
      <div id="buttons-cont">
        <a
          id="min"
          data-uk-icon="icon: minus; ratio: 1.3"
          onClick={() => {
            currentWindow.minimize()
          }}
        />
        <a
          id="max"
          onClick={() => {
            if (!isMaximize) {
              setIsMaximize(true)
              currentWindow.maximize()
            } else {
              setIsMaximize(false)
              currentWindow.unmaximize()
              currentWindow.setSize(width, height)
            }
          }}
          data-uk-icon={`icon: ${!isMaximize ? 'expand' : 'shrink'}; ratio: 1.3`}
        />
        <a
          id="close"
          data-uk-icon="icon: close; ratio: 1.3"
          onClick={() => currentWindow.close()}
        />
      </div>
    </div>
  )
}

export default DefaultTitleBar
