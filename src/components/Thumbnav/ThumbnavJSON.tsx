import React, { useEffect, useState } from 'react'

import { Button } from '../Button'

import ImageUploaderInstance from '../../utils/ImageUploaderInstance'

import { localeInstance } from '../../i18n'

import './ThumbnavSlideshow.css'

interface Props {
  jsons: string[]
  onChange: (images: string[]) => void
}

const ThumbnavJSON = ({ jsons, onChange }: Props) => {
  const {
    photoSlideshow: { dropArea },
  } = localeInstance.get.localizations

  const [jsonsTemp, setJsonsTemp] = useState(jsons)
  const [filename, setFilename] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [dropStyle, setDropStyle] = useState('')
  const [dropRef, setDropRef] = useState(React.createRef<HTMLDivElement>())

  useEffect(() => {
    const handleDragEvents = evt => {
      evt.preventDefault()
      evt.stopPropagation()

      if (['dragenter', 'dragover'].includes(evt.type)) {
        setDropStyle('thumbnav-drag-attempt')
      }

      if (['dragleave', 'drop'].includes(evt.type)) {
        setDropStyle('')
      }

      if (evt.type === 'drop') {
        const dataTransfer = evt.dataTransfer
        if (dataTransfer && dataTransfer.files.length > 0) {
          // onImageOpen(dataTransfer.files)
        }
      }
    }

    dropRef.current!.addEventListener('dragenter', handleDragEvents, false)
    dropRef.current!.addEventListener('dragover', handleDragEvents, false)
    dropRef.current!.addEventListener('dragleave', handleDragEvents, false)
    dropRef.current!.addEventListener('drop', handleDragEvents, false)
  }, [])

  const handleDelete = () => {
    jsonsTemp.splice(selectedIndex, 1)
    const newJson = [...jsonsTemp]
    setJsonsTemp(newJson)
    setSelectedIndex(0)
    onChange(newJson)
  }

  const readmultifiles = files => {
    const reader = new FileReader()
    const readFile = index => {
      if (index >= files.length) {
        return
      }
      const file = files[index]
      reader.onloadend = function() {
        const bin = this.result
        if (bin) {
          const jfiles = jsonsTemp
          jfiles.push(bin.toString())
          setJsonsTemp(jfiles)
          onChange(jfiles)
          readFile(index + 1)
        }
      }
      reader.readAsText(file)
    }
    readFile(0)
  }

  const toArray = fileList => {
    return Array.prototype.slice.call(fileList)
  }

  return (
    <div ref={dropRef} className="custom-height-import">
      <div
        className={`uk-position-relative ${dropStyle} custom-height-import`}
        data-uk-slideshow="animation: fade"
      >
        <ul>
          {jsons.length === 0 ? (
            <div className="uk-placeholder uk-flex uk-flex-middle uk-flex-center custom-height-import">
              <span data-uk-icon="icon: cloud-upload" />
              <span className="uk-text-middle">{dropArea.placeholder}</span>
              <div className="color-primary" data-uk-form-custom>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  onChange={evt => {
                    const files = evt.target.files
                    const names: string[] = filename
                    if (files) {
                      if (evt.target.files) {
                        for (let i = 0; i <= files.length - 1; i++) {
                          names.push(files[i].name)
                          console.log(files[i].name)
                        }
                        readmultifiles(evt.target.files)
                      }
                    }
                  }}
                  accept="application/JSON"
                />
                &nbsp;{dropArea.selectLabel}
              </div>
            </div>
          ) : null}
        </ul>

        <div className="uk-position-bottom-center uk-position-small">
          <ul className="uk-thumbnav">
            {jsons.map((image: string, index: number) => (
              <li
                id={`media-${index}`}
                key={image}
                data-uk-slideshow-item={index.toString()}
                onClick={() => setSelectedIndex(index)}
                className="json-file-list"
              >
                <a href="/#" onClick={evt => evt.preventDefault()}>
                  <img id="image-nav" src="images/json-file.png" width="100" alt="thumbnail" />
                </a>
                {filename[index]}
              </li>
            ))}
          </ul>
        </div>

        {jsons.length > 0 ? (
          <div className="uk-position-top-right uk-position-small">
            <Button
              id="media-delete"
              className="uk-button uk-button-danger uk-button-small uk-margin-left"
              type="button"
              onClick={() => {
                handleDelete()
              }}
            >
              <span uk-icon="icon: trash" />
            </Button>
          </div>
        ) : null}
      </div>

      {jsons.length > 0 ? (
        <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-top">
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={evt => {
              const files = evt.target.files
              const names: string[] = filename
              if (files) {
                if (evt.target.files) {
                  for (let i = 0; i <= files.length - 1; i++) {
                    names.push(files[i].name)
                    console.log(files[i].name)
                  }
                  readmultifiles(evt.target.files)
                }
              }
            }}
            accept="application/JSON"
            hidden
          />
          <Button
            className="uk-button uk-button-primary uk-button-small uk-margin-left"
            onClick={evt => {
              evt.preventDefault()
              const fileUploadHandler = document.getElementById('file-upload')
              if (fileUploadHandler) {
                fileUploadHandler!.click()
              }
            }}
          >
            <span uk-icon="icon: plus" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default ThumbnavJSON
