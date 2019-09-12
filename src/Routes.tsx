import React from 'react'
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom'
import { BreadCrumb } from './components/BreadCrumb'
import { NavBar } from './components/NavBar'
import ProfileModel from './models/Profile'
import {
  Checkout,
  CreateListing,
  History,
  Home,
  ListingInformation,
  Profile,
  WalletView,
} from './pages'
import DevMode from './pages/DevMode'
import DisputeView from './pages/DisputeView'
import OrderView from './pages/OrderView'
import { ProfileSettings } from './pages/Settings'

interface BreadHistory {
  link: string
  name: string
}

interface RouteProps {
  profile: ProfileModel
  history: BreadHistory[]
}

const Routes = ({ history, profile }: RouteProps) => (
  <HashRouter>
    <NavBar profile={profile} isSearchBarShow />
    {history.length > 1 ? <BreadCrumb history={history} /> : null}
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
      <Route path="/dev" exact component={DevMode} />
    </Switch>
  </HashRouter>
)

export default Routes
