import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { CreateListing, Home, ListingInformation, Profile, UserRegistration } from './pages'
import { ProfileSettings } from './pages/Settings'

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={UserRegistration} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/listing/create" exact component={CreateListing} />
      <Route path="/settings/profile" exact component={ProfileSettings} />
      <Route path="/listing/:id" exact component={ListingInformation} />
    </Switch>
  </BrowserRouter>
)

export default Routes
