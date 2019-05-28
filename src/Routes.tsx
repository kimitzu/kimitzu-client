import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Profile from './components/Header/ViewProfile'
import { Home, UserRegistration } from './pages'

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={UserRegistration} />
      <Route path="/profile" exact component={Profile} />
    </Switch>
  </BrowserRouter>
)

export default Routes
