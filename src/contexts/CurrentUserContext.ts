import React from 'react'
import Profile from '../models/Profile'

const currentUser = new Profile()
const CurrentUserContext = React.createContext({
  currentUser,
  updateCurrentUser: (profile: Profile) => {
    /**
     * This is an abstract method and
     * implementation details will be
     * overwritten in App.tsx.
     */
  },
})

export default CurrentUserContext
