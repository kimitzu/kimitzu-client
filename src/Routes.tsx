import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home, UserRegistration } from './pages'

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={UserRegistration} />
    </Switch>
  </BrowserRouter>
)

export default Routes
