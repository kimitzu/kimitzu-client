import React from 'react'

import { DropArea } from '../Upload'

import './ThumbnavSlideshow.css'

interface Props {
  images: string[]
  onImageOpen: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const ThumbnavSlideshow = ({ images, onImageOpen }: Props) => {
  return (
    <div className="uk-position-relative" data-uk-slideshow="animation: fade">
      <ul className="uk-slideshow-items">
        {images.length === 0 ? (
          <DropArea
            placeholder=" Drag and drop a photo or "
            selectLabel="select"
            onImageOpen={onImageOpen}
          />
        ) : (
          images.map((image: string) => (
            <li key={image}>
              <img src={image} alt="" data-uk-cover />
            </li>
          ))
        )}
      </ul>
      <div className="uk-position-bottom-center uk-position-small">
        <ul className="uk-thumbnav">
          {images.map((image: string, index: number) => (
            <li key={image} data-uk-slideshow-item={index.toString()}>
              <a href="#">
                <img id="image-nav" src={image} width="100" alt="" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ThumbnavSlideshow
