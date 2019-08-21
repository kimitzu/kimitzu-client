import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import {
  Checkout,
  CreateListing,
  History,
  Home,
  ListingInformation,
  Profile,
  WalletView,
} from './pages'
import DisputeView from './pages/DisputeView'
import OrderView from './pages/OrderView'
import { ProfileSettings } from './pages/Settings'

const Routes = () => (
  <HashRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/wallet" exact component={WalletView} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/profile/:id" exact component={Profile} />
      <Route path="/listing/create" exact component={CreateListing} />
      <Route path="/listing/edit/:id" exact component={CreateListing} />
      <Route path="/settings" exact component={ProfileSettings} />
      <Route path="/listing/:id" exact component={ListingInformation} />
      <Route path="/history/:view" exact component={History} />
      <Route path="/history/cases/:id" exact component={DisputeView} />
      <Route path="/history/:view/:id" exact component={OrderView} />
      <Route path="/listing/checkout/:id/:quantity" exact component={Checkout} />
    </Switch>
  </HashRouter>
)

export default Routes
