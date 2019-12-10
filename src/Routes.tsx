import {
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  isPlatform,
} from '@ionic/react'
import { IonReactHashRouter } from '@ionic/react-router'
import { home, person, pricetags, wallet } from 'ionicons/icons'
import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
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

/* Basic CSS for apps built with Ionic */
// import '@ionic/react/css/normalize.css'
// import '@ionic/react/css/structure.css'
// import '@ionic/react/css/typography.css'

interface BreadHistory {
  link: string
  name: string
}

interface RouteProps {
  history: BreadHistory[]
}

const renderMobileTabs = ({ currentUser, settings, updateCurrentUser }) => (
  <IonTabs>
    <IonRouterOutlet key={window.location.href}>
      <Route path="/" exact render={props => <Home {...props} currentUser={currentUser} />} />
      <Route
        path="/profile"
        exact
        render={props => <Profile {...props} profileContext={{ settings, currentUser }} />}
      />
      <Route path="/wallet" exact component={WalletView} />
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
      <Route
        path="/listing/checkout/:id/:quantity"
        exact
        render={props => <Checkout {...props} currentUser={currentUser} />}
      />
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton
        tab="home"
        onClick={() => {
          window.location.hash = '/'
        }}
      >
        <IonIcon icon={home} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="store" onClick={() => (window.location.hash = '/profile')}>
        <IonIcon icon={pricetags} />
        <IonLabel>Store</IonLabel>
      </IonTabButton>
      <IonTabButton tab="wallet" onClick={() => (window.location.hash = '/wallet')}>
        <IonIcon icon={wallet} />
        <IonLabel>Wallet</IonLabel>
      </IonTabButton>
      <IonTabButton tab="account" onClick={() => (window.location.hash = '/settings')}>
        <IonIcon icon={person} />
        <IonLabel>Account</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
)

const Routes = ({ history }: RouteProps) => {
  return (
    <CurrentUserContext.Consumer>
      {({ currentUser, settings, updateCurrentUser }) => {
        if (isPlatform('mobile') || isPlatform('mobileweb')) {
          return (
            <IonReactHashRouter>
              <IonRouterOutlet>
                <Route
                  path="/"
                  component={() => renderMobileTabs({ currentUser, settings, updateCurrentUser })}
                />
                <Route
                  path="/listing/edit/:id"
                  exact
                  render={props => (
                    <CreateListing {...props} currentUser={currentUser} settings={settings} />
                  )}
                />
                <Route
                  path="/listing/:id"
                  exact
                  render={props => <ListingInformation {...props} currentUser={currentUser} />}
                />
              </IonRouterOutlet>
            </IonReactHashRouter>
          )
        }
        return (
          <IonReactHashRouter>
            <IonPage>
              <NavBar profile={currentUser} isSearchBarShow />
              {history.length > 1 ? <BreadCrumb history={history} /> : null}
              <IonContent>
                <Switch key={window.location.href}>
                  <Route
                    path="/"
                    exact
                    render={props => <Home {...props} currentUser={currentUser} />}
                  />
                  <Route path="/wallet" exact component={WalletView} />
                  <Route
                    path="/profile"
                    exact
                    render={props => (
                      <Profile {...props} profileContext={{ settings, currentUser }} />
                    )}
                  />
                  <Route
                    path="/profile/:id"
                    exact
                    render={props => (
                      <Profile {...props} profileContext={{ settings, currentUser }} />
                    )}
                  />
                  <Route
                    path="/listing/create"
                    exact
                    render={props => (
                      <CreateListing {...props} currentUser={currentUser} settings={settings} />
                    )}
                  />
                  <Route
                    path="/listing/edit/:id"
                    exact
                    render={props => (
                      <CreateListing {...props} currentUser={currentUser} settings={settings} />
                    )}
                  />
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
              </IonContent>
            </IonPage>
          </IonReactHashRouter>
        )
      }}
    </CurrentUserContext.Consumer>
  )
}

export default Routes
