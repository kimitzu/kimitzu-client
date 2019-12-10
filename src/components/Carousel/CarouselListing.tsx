import React, { useEffect, useState } from 'react'

import config from '../../config'
import './CarouselListing.css'

interface Image {
  src: string
}

interface Props {
  data: Image[]
}

const CarouselListing = ({ data }: Props) => {
  let defaultSrc = ''
  const [id, setID] = useState('')
  const [src, setSrc] = useState(defaultSrc)
  const [runOnce, setRunOnce] = useState(true)

  useEffect(() => {
    if (data.length < 1) {
      data = [{ src: `${process.env.PUBLIC_URL}/images/pictureBig.png` }]
      defaultSrc = data[0].src
      setSrc(defaultSrc)
      simulateClick('img1')
    }

    if (data.length !== 0 && runOnce) {
      defaultSrc = data[0].src
      simulateClick('img1')
    }
  })

  function prepareImage(idFocus: number, imgSrc: string) {
    setID('img' + idFocus)
    setSrc(imgSrc)
    setRunOnce(false)
  }

  function next() {
    const idNum = id.replace('img', '')
    let num = 0
    if (Number(idNum) < data.length) {
      num = Number(idNum) + 1
    } else {
      num = Number(idNum) - data.length + 1
    }
    const newID = 'img' + num.toString()
    setRunOnce(false)
    simulateClick(newID)
  }

  function simulateClick(btnID: string) {
    const el = document.getElementById(btnID)
    if (el) {
      el.click()
    }
  }

  function prev() {
    const idNum = id.replace('img', '')
    let num = 0
    if (Number(idNum) === 1) {
      num = Number(idNum) + data.length - 1
    } else {
      num = Number(idNum) - 1
    }
    const newID = 'img' + num.toString()
    setRunOnce(false)
    simulateClick(newID)
  }

  return (
    <div>
      <div className="main-img">
        <img
          className="main-img-child image-contain"
          src={src}
          alt=""
          onClick={() =>
            window.UIkit.lightbox(document.getElementById('lightboxcont')).show(
              Number(id.replace('img', '')) - 1
            )
          }
          onError={(ev: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const image = ev.target as HTMLImageElement
            image.onerror = null
            image.src = `${config.host}/images/picture.png`
          }}
        />
      </div>

      <div
        id="lightboxcont"
        className="uk-child-width-1-1@m"
        data-uk-grid
        data-uk-lightbox="animation: slide"
      >
        {data.map((img, i) => {
          i++
          return (
            <a
              key={`lightbox${i}`}
              className="uk-inline"
              href={img.src}
              data-caption={`${i} of ${data.length}`}
              data-type="image"
            />
          )
        })}
      </div>

      <br />
      <div
        className="uk-position-relative uk-visible-toggle uk-light"
        data-uk-slider
        draggable={false}
      >
        <ul id="image-list" className="uk-slider-items uk-grid" data-uk-grid>
          {data.map((img, i) => {
            i++
            return (
              <li
                key={'img' + i}
                id={'img' + i}
                onClick={() => prepareImage(i, img.src)}
                className="image-list-li"
              >
                <img
                  src={img.src}
                  alt=""
                  className={[
                    id === 'img' + i ? 'image-selected img-height' : 'img-height',
                    'image-cover',
                  ].join(' ')}
                />
              </li>
            )
          })}
        </ul>

        <div className="uk-position-center-left nav-shadow-left btn-nav-left uk-hidden-hover" />
        <span
          data-uk-icon="icon: chevron-left; ratio: 2"
          className="uk-position-center-left"
          data-uk-slidenav-previous
          data-uk-slider-item="previous"
          onClick={() => prev()}
        />
        <div className="uk-position-center-right nav-shadow-right btn-nav-right uk-hidden-hover" />
        <span
          data-uk-icon="icon: chevron-right; ratio: 2"
          className="uk-position-center-right"
          data-uk-slidenav-next
          data-uk-slider-item="next"
          onClick={() => next()}
        />
      </div>
    </div>
  )
}

export default CarouselListing
