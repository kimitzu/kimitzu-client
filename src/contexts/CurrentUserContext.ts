import React from 'react'
import Chat from '../models/Chat'
import Profile from '../models/Profile'
import Settings from '../models/Settings'

const currentUser = new Profile()
const settings = new Settings()
const chat = new Chat()
const CurrentUserContext = React.createContext({
  currentUser,
  settings,
  chat,
  updateCurrentUser: (profile: Profile) => {
    /**
     * This is an abstract method and
     * implementation details will be
     * overwritten in App.tsx.
     */
  },
})

export default CurrentUserContext
