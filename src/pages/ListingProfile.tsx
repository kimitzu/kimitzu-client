import React, { Component } from 'react'
import NavBar from '../components/NavBar/NavBar'

import './ListingProfile.css'

interface State {
  currentIndex: number
  hasStarted: boolean
  numberOfPages: number
}

class ListingProfile extends Component<{}, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentIndex: 1,
      hasStarted: false,
      numberOfPages: 2,
    }
  }

  public render() {
    return (
      <div id="reg-container">
        <div id="card-head" className="uk-card uk-card-default uk-card-body">
          <div id="profile-header">
            <div id="left-content">
              <div
                className="uk-position-relative uk-visible-toggle uk-light"
                draggable={false}
                data-uk-slideshow
              >
                <ul className="uk-slideshow-items">
                  <li>
                    <img
                      src="https://i.ytimg.com/vi/S7OCzDNeENg/maxresdefault.jpg"
                      alt=""
                      data-uk-cover
                    />
                  </li>
                  <li>
                    <img
                      src="https://i.ytimg.com/vi/S7OCzDNeENg/maxresdefault.jpg"
                      alt=""
                      data-uk-cover
                    />
                  </li>
                  <li>
                    <img
                      src="https://i.ytimg.com/vi/S7OCzDNeENg/maxresdefault.jpg"
                      alt=""
                      data-uk-cover
                    />
                  </li>
                </ul>

                <span
                  data-uk-icon="icon: chevron-left; ratio: 2"
                  className="uk-slidenav-large uk-position-center-left uk-position-small uk-hidden-hover"
                  data-uk-slidenav-previous
                  data-uk-slideshow-item="previous"
                />
                <span
                  data-uk-icon="icon: chevron-right; ratio: 2"
                  className="uk-slidenav-large uk-position-center-right uk-position-small uk-hidden-hover"
                  data-uk-slidenav-next
                  data-uk-slideshow-item="next"
                />
              </div>
              <br />
              <div className="uk-position-relative uk-visible-toggle uk-light" data-uk-slider>
                <ul className="uk-slider-items uk-child-width-1-2 uk-child-width-1-3@m uk-grid">
                  <li>
                    <div className="uk-panel">
                      <img src="https://i.ytimg.com/vi/S7OCzDNeENg/maxresdefault.jpg" alt="" />
                      <div className="uk-position-center uk-panel">
                        <h1>1</h1>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="uk-panel">
                      <img src="https://i.ytimg.com/vi/S7OCzDNeENg/maxresdefault.jpg" alt="" />
                      <div className="uk-position-center uk-panel">
                        <h1>2</h1>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="uk-panel">
                      <img src="https://i.ytimg.com/vi/S7OCzDNeENg/maxresdefault.jpg" alt="" />
                      <div className="uk-position-center uk-panel">
                        <h1>3</h1>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="uk-panel">
                      <img src="https://i.ytimg.com/vi/S7OCzDNeENg/maxresdefault.jpg" alt="" />
                      <div className="uk-position-center uk-panel">
                        <h1>4</h1>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className="uk-panel">
                      <img src="https://i.ytimg.com/vi/S7OCzDNeENg/maxresdefault.jpg" alt="" />
                      <div className="uk-position-center uk-panel">
                        <h1>4</h1>
                      </div>
                    </div>
                  </li>
                </ul>

                <span
                  data-uk-icon="icon: chevron-left; ratio: 2"
                  className="uk-position-center-left uk-position-small uk-hidden-hover"
                  data-uk-slidenav-previous
                  data-uk-slider-item="previous"
                />
                <span
                  data-uk-icon="icon: chevron-right; ratio: 2"
                  className="uk-position-center-right uk-position-small uk-hidden-hover"
                  data-uk-slidenav-next
                  data-uk-slider-item="next"
                />
              </div>
              <ul className="uk-slider-nav uk-dotnav uk-flex-center uk-margin" />
            </div>
            <div id="right-content">right</div>
          </div>
        </div>
      </div>
    )
  }
}

export default ListingProfile
