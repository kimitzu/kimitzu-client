import React, { Component } from 'react'
import { CarouselListing } from '../components/Carousel'
import NavBar from '../components/NavBar/NavBar'

import './ListingProfile.css'

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
            <div id="right-content">right</div>
          </div>
        </div>
      </div>
    )
  }
}

export default ListingProfile
