import React from 'react'
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom'
import { BreadCrumb } from './components/BreadCrumb'
import { NavBar } from './components/NavBar'
import CurrentUserContext from './contexts/CurrentUserContext'
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
  history: BreadHistory[]
}

const Routes = ({ history }: RouteProps) => (
  <CurrentUserContext.Consumer>
    {({ currentUser, settings, updateCurrentUser }) => (
      <HashRouter>
        <NavBar profile={currentUser} isSearchBarShow />
        {history.length > 1 ? <BreadCrumb history={history} /> : null}
        <Switch key={window.location.href}>
          <Route path="/" exact render={props => <Home {...props} currentUser={currentUser} />} />
          <Route path="/wallet" exact component={WalletView} />
          <Route
            path="/profile"
            exact
            render={props => <Profile {...props} profileContext={{ settings, currentUser }} />}
          />
          <Route
            path="/profile/:id"
            exact
            render={props => <Profile {...props} profileContext={{ settings, currentUser }} />}
          />
          <Route
            path="/listing/create"
            exact
            render={props => (
              <CreateListing {...props} currentUser={currentUser} settings={settings} />
            )}
          />
          <Route path="/listing/edit/:id" exact component={CreateListing} />
          <Route
            path="/settings"
            exact
            render={props => (
              <ProfileSettings
                {...props}
                profileContext={{ currentUser, settings, updateCurrentUser }}
              />
            )}
          />
          <Route
            path="/listing/:id"
            exact
            render={props => <ListingInformation {...props} currentUser={currentUser} />}
          />
          <Route path="/history/:view" exact component={History} />
          <Route path="/history/cases/:id" exact component={DisputeView} />
          <Route path="/history/:view/:id" exact component={OrderView} />
          <Route
            path="/listing/checkout/:id/:quantity"
            exact
            render={props => <Checkout {...props} currentUser={currentUser} />}
          />
          <Route path="/dev" exact component={DevMode} />
        </Switch>
      </HashRouter>
    )}
  </CurrentUserContext.Consumer>
)

export default Routes
