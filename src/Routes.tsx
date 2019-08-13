import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import {
  Checkout,
  CreateListing,
  History,
  Home,
  ListingInformation,
  Profile,
  UserRegistration,
} from './pages'
import DisputeView from './pages/DisputeView'
import OrderView from './pages/OrderView'
import { ProfileSettings } from './pages/Settings'

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={UserRegistration} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/profile/:id" exact component={Profile} />
      <Route path="/listing/create" exact component={CreateListing} />
      <Route path="/listing/edit/:id" exact component={CreateListing} />
      <Route path="/settings/profile" exact component={ProfileSettings} />
      <Route path="/listing/:id" exact component={ListingInformation} />
      <Route path="/history/:view" exact component={History} />
      <Route path="/history/cases/:id" exact component={DisputeView} />
      <Route path="/history/:view/:id" exact component={OrderView} />
      <Route path="/listing/checkout/:id/:quantity" exact component={Checkout} />
    </Switch>
  </BrowserRouter>
)

export default Routes
