import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { CreateListing, Home, ListingProfile, Profile, UserRegistration } from './pages'

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={UserRegistration} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/listing/profile" exact component={ListingProfile} />
      <Route path="/listing/create" exact component={CreateListing} />
    </Switch>
  </BrowserRouter>
)

export default Routes
