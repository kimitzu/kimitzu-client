import React, { useEffect, useState } from 'react'

import './DefaultTitleBar.css'

const DefaultTitleBar = () => {
  const remote = window.remote
  const currentWindow = remote.getCurrentWindow()
  const { webContents } = currentWindow
  const [[width, height]] = useState(currentWindow.getSize())
  const [isMaximize, setIsMaximize] = useState(false)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const handleListener = () => {
    setCanGoBack(webContents.canGoBack())
    setCanGoForward(webContents.canGoForward())
  }
  useEffect(() => {
    window.addEventListener('hashchange', handleListener)
    return () => {
      window.removeEventListener('hashchange', handleListener)
    }
  }, [])
  return (
    <div id="title-cont">
      <div id="control-cont">
        <a
          id={!canGoBack ? 'disable-icon-arrow' : ''}
          className="icon-arrows"
          onClick={evt => {
            evt.preventDefault()
            webContents.goBack()
          }}
          data-uk-icon="icon: chevron-left; ratio: 1.5"
          href="/#"
        >
          &nbsp;
        </a>
        <a
          id={!canGoForward ? 'disable-icon-arrow' : ''}
          className="icon-arrows"
          onClick={evt => {
            evt.preventDefault()
            webContents.goForward()
          }}
          data-uk-icon="icon: chevron-right; ratio: 1.5"
          href="/#"
        >
          &nbsp;
        </a>
        <a
          className="icon-ref"
          onClick={evt => {
            evt.preventDefault()
            webContents.reload()
          }}
          data-uk-icon="icon: refresh; ratio: 1.2"
          href="/#"
        >
          &nbsp;
        </a>
      </div>
      <div id="url-cont">
        <input id="url-input" onChange={() => console.log('Feature not yet implemented')} />
      </div>
      <div id="buttons-cont">
        <a
          id="min"
          data-uk-icon="icon: minus; ratio: 1.3"
          onClick={evt => {
            evt.preventDefault()
            currentWindow.minimize()
          }}
          href="/#"
        >
          &nbsp;
        </a>
        <a
          id="max"
          onClick={evt => {
            evt.preventDefault()
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
          href="/#"
        >
          &nbsp;
        </a>
        <a
          id="close"
          data-uk-icon="icon: close; ratio: 1.3"
          onClick={evt => {
            evt.preventDefault()
            currentWindow.close()
          }}
          href="/#"
        >
          &nbsp;
        </a>
      </div>
    </div>
  )
}

export default DefaultTitleBar
