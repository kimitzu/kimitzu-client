import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home, ListingProfile, Profile, UserRegistration } from './pages'

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={UserRegistration} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/listing/profile" exact component={ListingProfile} />
    </Switch>
  </BrowserRouter>
)

export default Routes
