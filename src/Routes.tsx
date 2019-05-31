import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home, ListingProfile, UserRegistration } from './pages'

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={UserRegistration} />
      <Route path="/listing/profile" exact component={ListingProfile} />
    </Switch>
  </BrowserRouter>
)

export default Routes
