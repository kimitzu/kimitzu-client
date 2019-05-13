import React, { Component } from 'react'

import IntroductionCard from '../components/Card/IntroductionCard'
import NavBar from '../components/NavBar/NavBar'

class Home extends Component {
  constructor(props: any) {
    super(props)
  }

  public render() {
    return (
      <div>
        <NavBar />
        <IntroductionCard />
      </div>
    )
  }
}

export default Home
