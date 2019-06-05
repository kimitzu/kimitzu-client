import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home, ListingInformation, Profile, UserRegistration } from './pages'

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={UserRegistration} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/listing/information" exact component={ListingInformation} />
    </Switch>
  </BrowserRouter>
)

export default Routes
