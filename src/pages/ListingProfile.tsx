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
        <div id="card-head" className="uk-card uk-card-default">
          <div id="profile-header">
            <div id="left-content">
              <div className="uk-card uk-card-default uk-card-body">
                <div data-uk-slider>
                  <ul className="uk-slider-items uk-child-width-1-3@s uk-child-width-1-4@">
                    <li>
                      <img
                        src="https://cdn.vox-cdn.com/thumbor/hJq_hq_GDsldfqsPJJIw8xJX-rA=/0x354:1064x1166/1200x800/filters:focal(376x510:546x680)/cdn.vox-cdn.com/uploads/chorus_image/image/56956201/2x3__25_.0.png"
                        alt=""
                      />
                    </li>
                    <li>
                      <img
                        src="https://cdn.vox-cdn.com/thumbor/hJq_hq_GDsldfqsPJJIw8xJX-rA=/0x354:1064x1166/1200x800/filters:focal(376x510:546x680)/cdn.vox-cdn.com/uploads/chorus_image/image/56956201/2x3__25_.0.png"
                        alt=""
                      />
                    </li>
                    <li>
                      <img
                        src="https://cdn.vox-cdn.com/thumbor/hJq_hq_GDsldfqsPJJIw8xJX-rA=/0x354:1064x1166/1200x800/filters:focal(376x510:546x680)/cdn.vox-cdn.com/uploads/chorus_image/image/56956201/2x3__25_.0.png"
                        alt=""
                      />
                    </li>
                    <li>
                      <img
                        src="https://cdn.vox-cdn.com/thumbor/hJq_hq_GDsldfqsPJJIw8xJX-rA=/0x354:1064x1166/1200x800/filters:focal(376x510:546x680)/cdn.vox-cdn.com/uploads/chorus_image/image/56956201/2x3__25_.0.png"
                        alt=""
                      />
                    </li>
                    <li>
                      <img
                        src="https://cdn.vox-cdn.com/thumbor/hJq_hq_GDsldfqsPJJIw8xJX-rA=/0x354:1064x1166/1200x800/filters:focal(376x510:546x680)/cdn.vox-cdn.com/uploads/chorus_image/image/56956201/2x3__25_.0.png"
                        alt=""
                      />
                    </li>
                    <li>
                      <img
                        src="https://cdn.vox-cdn.com/thumbor/hJq_hq_GDsldfqsPJJIw8xJX-rA=/0x354:1064x1166/1200x800/filters:focal(376x510:546x680)/cdn.vox-cdn.com/uploads/chorus_image/image/56956201/2x3__25_.0.png"
                        alt=""
                      />
                    </li>
                  </ul>
                  <button
                    className="uk-position-center-left uk-position-small uk-hidden-hover"
                    data-uk-slidenav-previous
                    uk-slider-item="next"
                  >
                    {'<'}
                  </button>
                  <button
                    className="uk-position-center-right uk-position-small uk-hidden-hover"
                    data-uk-slidenav-next
                    uk-slider-item="previous"
                  >
                    {'>'}
                  </button>
                </div>
              </div>
            </div>
            <div id="right-content">right</div>
          </div>
        </div>
      </div>
    )
  }
}

export default ListingProfile
