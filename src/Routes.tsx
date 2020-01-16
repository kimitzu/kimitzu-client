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
import { home, mail, person, pricetags, wallet } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { BreadCrumb } from './components/BreadCrumb'
import { NavBar } from './components/NavBar'
import CurrentUserContext from './contexts/CurrentUserContext'
import Chat from './models/Chat'
import {
  Checkout,
  CreateListing,
  History,
  Home,
  ListingInformation,
  Profile,
  WalletView,
} from './pages'
import MobileChat from './pages/Chat/MobileChat'
import MobileConversation from './pages/Chat/MobileConversation'
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
  chat: Chat
}

const MobileTabs = ({ currentUser, settings, updateCurrentUser }) => {
  const TAB_CONSTANTS = {
    HOME: 0,
    MESSAGES: 1,
    STORE: 2,
    WALLET: 3,
    ACCOUNT: 4,
  }
  const [selectedTab, setSelectedTab] = useState<number>(TAB_CONSTANTS.HOME)
  const updateSelectedTab = (hash: string) => {
    switch (hash) {
      case '#/tabs/home':
        setSelectedTab(TAB_CONSTANTS.HOME)
        break
      case '#/tabs/messages':
        setSelectedTab(TAB_CONSTANTS.MESSAGES)
        break
      case '#/tabs/profile':
        setSelectedTab(TAB_CONSTANTS.STORE)
        break
      case '#/tabs/wallet':
        setSelectedTab(TAB_CONSTANTS.WALLET)
        break
      case '#/tabs/settings':
        setSelectedTab(TAB_CONSTANTS.ACCOUNT)
        break
      default:
        setSelectedTab(TAB_CONSTANTS.HOME)
    }
  }
  useEffect(() => {
    const { hash } = window.location
    updateSelectedTab(hash)
    console.log(selectedTab)
  }, [])
  console.log(selectedTab)
  return (
    <IonTabs>
      <IonRouterOutlet key={window.location.href}>
        <Route
          path="/tabs/home"
          exact
          render={props => <Home {...props} currentUser={currentUser} />}
        />
        <Route path="/tabs/messages" exact component={MobileChat} />
        <Route
          path="/tabs/profile"
          exact
          render={props => <Profile {...props} profileContext={{ settings, currentUser }} />}
        />
        <Route path="/tabs/wallet" exact component={WalletView} />
        <Route
          path="/tabs/settings"
          exact
          render={props => (
            <ProfileSettings
              {...props}
              profileContext={{ currentUser, settings, updateCurrentUser }}
            />
          )}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton
          tab="home"
          selected={selectedTab === TAB_CONSTANTS.HOME}
          onClick={() => {
            window.location.hash = '/tabs/home'
            setSelectedTab(TAB_CONSTANTS.HOME)
          }}
        >
          <IonIcon icon={home} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="messages"
          selected={selectedTab === TAB_CONSTANTS.MESSAGES}
          onClick={() => {
            window.location.hash = '/tabs/messages'
            setSelectedTab(TAB_CONSTANTS.MESSAGES)
          }}
        >
          <IonIcon icon={mail} />
          <IonLabel>Messages</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="store"
          selected={selectedTab === TAB_CONSTANTS.STORE}
          onClick={() => {
            window.location.hash = '/tabs/profile'
            setSelectedTab(TAB_CONSTANTS.STORE)
          }}
        >
          <IonIcon icon={pricetags} />
          <IonLabel>Store</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="wallet"
          selected={selectedTab === TAB_CONSTANTS.WALLET}
          onClick={() => {
            window.location.hash = '/tabs/wallet'
            setSelectedTab(TAB_CONSTANTS.WALLET)
          }}
        >
          <IonIcon icon={wallet} />
          <IonLabel>Wallet</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="account"
          selected={selectedTab === TAB_CONSTANTS.ACCOUNT}
          onClick={() => {
            window.location.hash = '/tabs/settings'
            setSelectedTab(TAB_CONSTANTS.ACCOUNT)
          }}
        >
          <IonIcon icon={person} />
          <IonLabel>Account</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  )
}

const Routes = ({ history, chat }: RouteProps) => {
  return (
    <CurrentUserContext.Consumer>
      {({ currentUser, settings, updateCurrentUser }) => {
        if (isPlatform('mobile') || isPlatform('mobileweb')) {
          return (
            <IonReactHashRouter>
              <IonRouterOutlet>
                <Route
                  path="/tabs"
                  component={() => (
                    <MobileTabs
                      currentUser={currentUser}
                      settings={settings}
                      updateCurrentUser={updateCurrentUser}
                    />
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
                  path="/listing/:id"
                  exact
                  render={props => <ListingInformation {...props} currentUser={currentUser} />}
                />
                <Route
                  path="/listing/checkout/:id/:quantity"
                  exact
                  render={props => <Checkout {...props} currentUser={currentUser} />}
                />
                <Route
                  path="/profile/:id"
                  exact
                  render={props => (
                    <Profile {...props} profileContext={{ settings, currentUser }} />
                  )}
                />
                <Route
                  path="/messages/:peerID"
                  exact
                  render={props => <MobileConversation chatData={chat} {...props} />}
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
