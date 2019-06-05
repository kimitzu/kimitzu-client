import React, { Component } from 'react'
import { CarouselListing } from '../components/Carousel'
import NavBar from '../components/NavBar/NavBar'

import './ListingInformation.css'

interface Image {
  src: string
}

interface State {
  currentIndex: number
  hasStarted: boolean
  numberOfPages: number
  data: Image[]
}

class ListingProfile extends Component<{}, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentIndex: 1,
      hasStarted: false,
      numberOfPages: 2,
      data: [
        {
          src:
            'https://ph-test-11.slatic.net/p/d73d6b78132305098d0ad001d5988f4c.jpg_340x340q80.jpg_.webp',
        },
        {
          src:
            'https://ph-test-11.slatic.net/p/c3610c01927bcc7a30d224952ed741e5.jpg_340x340q80.jpg_.webp',
        },
        {
          src:
            'https://ph-test-11.slatic.net/p/d777cae80931e046f1ba301de13c85b4.jpg_340x340q80.jpg_.webp',
        },
        {
          src:
            'https://ph-test-11.slatic.net/p/ff6e1303f814fbde8e01dcf7117c0124.jpg_340x340q80.jpg_.webp',
        },
        {
          src:
            'https://ph-test-11.slatic.net/p/592f1ff4e19dfc79869066ef618fce77.jpg_340x340q80.jpg_.webp',
        },
        {
          src:
            'https://ph-test-11.slatic.net/p/0a2d68aa293e6be515377c2edf7937b8.jpg_340x340q80.jpg_.webp',
        },
        {
          src:
            'https://ph-test-11.slatic.net/p/096d7bbdc85794ca701b9cc3f2071f1c.jpg_340x340q80.jpg_.webp',
        },
      ],
    }
  }

  public render() {
    return (
      <div id="reg-container">
        <div id="card-head" className="uk-card uk-card-default uk-card-body">
          <div id="profile-header">
            <div id="left-content">
              <CarouselListing data={this.state.data} />
            </div>
            <div id="right-content">
              <div id="head-content">
                <p className="uk-text-large uk-text-bold text-blue">Listing Name</p>
                <p className="uk-text-small">
                  Type: <p className="uk-display-inline uk-text-bold">Physical Good</p>
                  &nbsp; &nbsp; Condition: <p className="uk-display-inline uk-text-bold">New</p>
                </p>
                <div id="starsContainer" className="uk-margin-small-top">
                  <a data-uk-icon="icon: star;" className="text-blue" />
                  <a data-uk-icon="icon: star;" className="text-blue uk-margin-left" />
                  <a data-uk-icon="icon: star;" className="text-blue uk-margin-left" />
                  <a data-uk-icon="icon: star;" className="text-blue uk-margin-left" />
                  <a data-uk-icon="icon: star;" className="text-blue uk-margin-left" />
                  <a id="rating" className="text-blue uk-margin-left uk-text-bold rating">
                    4.0
                  </a>
                </div>
                <a className="uk-text-small text-blue uk-margin-small-top">
                  How ratings are calculated
                </a>
                <br />
                <hr />
                <p className="text-blue priceSize uk-margin-small-top">$20.00/hr</p>
                <div id="footerContent" className="uk-margin-medium-top">
                  <div id="footerContentLeft">
                    <div>
                      <span>Hour:</span>
                      <a
                        id="hourSelector"
                        data-uk-icon="icon: plus;"
                        className="text-blue uk-margin-left "
                      />
                      <span className="uk-margin-left">1</span>
                      <a
                        id="hourSelector"
                        data-uk-icon="icon: minus;"
                        className="text-blue uk-margin-left "
                      />
                    </div>
                    <button className="uk-button uk-button-primary uk-button-large uk-margin-medium-top uk-text-bold btnRound">
                      BUY
                    </button>
                  </div>
                  <div id="footerContentRight">
                    <span id="soldbytext">Sold by:</span>
                    <div id="soldByCont">
                      <div id="soldByContLeft">
                        <img
                          className="uk-border-circle"
                          src="https://getuikit.com/docs/images/avatar.jpg"
                          width="65"
                          height="65"
                          alt="Border circle"
                        />
                      </div>
                      <div id="soldByContRight">
                        <p className="uk-text-medium uk-text-bold text-blue">John Doe</p>
                        <div>
                          <a data-uk-icon="icon: mail; ratio: 1.5;" className="text-blue" />
                          <span className="uk-text-small uk-margin-small-left">Message</span>
                        </div>
                      </div>
                    </div>
                    <p className="uk-text-medium uk-text-bold text-blue uk-margin-small-top underlinedText">
                      GO TO STORE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ListingProfile
