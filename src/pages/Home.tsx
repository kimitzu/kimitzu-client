import React, { Component } from 'react'

import NavBar from '../components/NavBar/NavBar'

class Home extends Component {
  constructor(props: any) {
    super(props)
  }

  public render() {
    return (
      <div>
        <NavBar />
      </div>
    )
  }
}

export default Home
