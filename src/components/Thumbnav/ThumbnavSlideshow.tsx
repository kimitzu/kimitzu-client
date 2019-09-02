import React, { useEffect, useState } from 'react'

import { DropArea } from '../Upload'

import ImageUploaderInstance from '../../utils/ImageUploaderInstance'
import './ThumbnavSlideshow.css'

interface Props {
  images: string[]
  onChange: (images: string[]) => void
}

const ThumbnavSlideshow = ({ images, onChange }: Props) => {
  const [photos, setPhotos] = useState(images)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleDelete = () => {
    images.splice(selectedIndex, 1)
    const newPhotos = [...images]
    setPhotos(newPhotos)
    setSelectedIndex(0)
    onChange(newPhotos)
  }

  const onImageOpen = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFiles = event.target.files
    const base64ImageFiles: Array<Promise<string>> = []

    if (!imageFiles) {
      return
    }

    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < imageFiles.length; index++) {
      const imageElement = imageFiles[index]
      base64ImageFiles.push(ImageUploaderInstance.convertToBase64(imageElement))
    }

    const base64ImageFilesUploadResults = await Promise.all(base64ImageFiles)
    const newPhotos = [...photos, ...base64ImageFilesUploadResults]
    setPhotos(newPhotos)
    onChange(newPhotos)
  }

  return (
    <div>
      <div className="uk-position-relative" data-uk-slideshow="animation: fade">
        <ul className="uk-slideshow-items">
          {photos.length === 0 ? (
            <DropArea
              placeholder=" Drag and drop a photo or "
              selectLabel="select"
              onImageOpen={onImageOpen}
            />
          ) : (
            photos.map((image: string) => (
              <li key={image} className="img-li-cont">
                <img src={image} alt="" />
              </li>
            ))
          )}
        </ul>
        <div className="uk-position-bottom-center uk-position-small">
          <ul className="uk-thumbnav">
            {photos.map((image: string, index: number) => (
              <li
                id={`media-${index}`}
                key={image}
                data-uk-slideshow-item={index.toString()}
                onClick={() => setSelectedIndex(index)}
              >
                <a href="#">
                  <img id="image-nav" src={image} width="100" alt="" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {photos.length > 0 ? (
          <div className="uk-position-top-right uk-position-small">
            <button
              id="media-delete"
              className="uk-button uk-button-danger uk-button-small uk-margin-left"
              type="button"
              onClick={() => {
                handleDelete()
              }}
            >
              <span uk-icon="icon: trash" />
            </button>
          </div>
        ) : null}
      </div>

      {photos.length > 0 ? (
        <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-top">
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={onImageOpen}
            accept="image/*"
            hidden
          />
          <button
            className="uk-button uk-button-primary uk-button-small uk-margin-left"
            onClick={evt => {
              evt.preventDefault()
              const fileUploadHandler = document.getElementById('file-upload')
              fileUploadHandler!.click()
            }}
          >
            <span uk-icon="icon: plus" />
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default ThumbnavSlideshow
