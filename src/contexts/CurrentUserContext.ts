import React from 'react'
import Profile from '../models/Profile'
import Settings from '../models/Settings'

const currentUser = new Profile()
const settings = new Settings()
const CurrentUserContext = React.createContext({
  currentUser,
  settings,
  updateCurrentUser: (profile: Profile) => {
    /**
     * This is an abstract method and
     * implementation details will be
     * overwritten in App.tsx.
     */
  },
})

export default CurrentUserContext
