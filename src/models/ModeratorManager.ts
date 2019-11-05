import Profile from './Profile'
import Settings from './Settings'
import { webSocketResponsesInstance } from './WebsocketResponses'

interface Moderators {
  selectedModerators: Profile[]
  availableModerators: Profile[]
  favoriteModerators: Profile[]
  recentModerators: Profile[]
  searchResultModerators: Profile[]
}

class ModeratorManager implements Moderators {
  public selectedModerators: Profile[] = []
  public availableModerators: Profile[] = []
  public favoriteModerators: Profile[] = []
  public recentModerators: Profile[] = []
  public searchResultModerators: Profile[] = []
  public settings: Settings = new Settings()
  public debounce: number = 0
  public currentPeerID: string = ''

  public async initialize(settings: Settings, currentPeerID: string) {
    this.settings = settings
    this.currentPeerID = currentPeerID
    settings.storeModerators.forEach(async moderator => {
      try {
        const profile = await Profile.retrieve(moderator)
        this.favoriteModerators.push(profile)
      } catch (e) {
        // Silently ignore unresolved moderators
      }
    })
    settings.recentModerators.forEach(async moderator => {
      try {
        const profile = await Profile.retrieve(moderator)
        this.recentModerators.push(profile)
      } catch (e) {
        // Silently ignore unresolved moderators
      }
    })

    const resolveAsyncModerators = (e: CustomEvent) => {
      const profile = e.detail as Profile

      if (this.currentPeerID === profile.peerID) {
        return
      }

      if (settings.storeModerators.includes(profile.peerID)) {
        return
      }

      if (settings.recentModerators.includes(profile.peerID)) {
        return
      }

      this.availableModerators = [...this.availableModerators, profile]
    }
    window.addEventListener('moderator-resolve', resolveAsyncModerators as EventListener)
    webSocketResponsesInstance.initialize()
  }

  public async setSelectedModerators(moderatorIDs: string[]) {
    const selectedModeratorsRequest = moderatorIDs.map(moderator => Profile.retrieve(moderator))
    const seletedModerators = await Promise.all(selectedModeratorsRequest)
    this.selectedModerators = seletedModerators
  }

  public selectModerator(moderator: Profile, moderatorSource: string, index: number) {
    if (moderatorSource === 'searchResultModerators') {
      /**
       * Search selection is most likely found on 'available moderators' list
       */
      if (!this.favoriteModerators.some(mod => mod.peerID === moderator.peerID)) {
        this.saveRecentModerator(moderator)
      }
    } else if (moderatorSource === 'availableModerators') {
      this.saveRecentModerator(moderator)
    }
    this[moderatorSource].splice(index, 1)
    if (!this.selectedModerators.some(mod => mod.peerID === moderator.peerID)) {
      this.selectedModerators.push(moderator)
    }
  }

  public async saveRecentModerator(moderator: Profile) {
    if (!this.recentModerators.some(mod => moderator.peerID === mod.peerID)) {
      this.recentModerators.unshift(moderator)
      this.recentModerators.splice(5)
      const settings = this.settings
      settings.recentModerators = this.recentModerators.map(mod => mod.peerID)
      await settings.save()
    }
  }

  public removeModeratorFromSelection(
    moderator: Profile,
    index: number,
    returnToAvailable?: boolean
  ) {
    this.selectedModerators.splice(index, 1)
    if (this.settings.storeModerators.includes(moderator.peerID)) {
      if (returnToAvailable) {
        this.favoriteModerators.splice(index, 1)
        this.availableModerators.push(moderator)
      } else {
        this.favoriteModerators.push(moderator)
      }
    } else if (this.settings.recentModerators.includes(moderator.peerID)) {
      if (!this.recentModerators.some(mod => moderator.peerID === mod.peerID)) {
        this.recentModerators.push(moderator)
      }
    } else {
      this.availableModerators.push(moderator)
    }
  }

  public async find(searchString: string) {
    if (!searchString) {
      this.searchResultModerators = []
      return
    }

    const filterModerator = moderator =>
      moderator.peerID === searchString ||
      new RegExp('\\b' + searchString + '.*', 'ig').test(moderator.name)

    const availableModeratorResults = this.availableModerators.filter(filterModerator)
    const recentModeratorResults = this.recentModerators.filter(filterModerator)
    const favoriteModeratorResults = this.favoriteModerators.filter(filterModerator)
    this.searchResultModerators = [
      ...favoriteModeratorResults,
      ...recentModeratorResults,
      ...availableModeratorResults,
    ]

    const PROFILE_ID_LENGTH = 46
    if (searchString.length < PROFILE_ID_LENGTH || searchString.trim().includes(' ')) {
      return
    }

    const isAlreadySelected = this.selectedModerators.some(
      moderator => moderator.peerID === searchString
    )

    if (isAlreadySelected) {
      return
    }

    const moderatorProfileResult = await Profile.retrieve(searchString)
    if (moderatorProfileResult.moderator) {
      this.searchResultModerators.push(moderatorProfileResult)
    }
  }
}

const moderatorManagerInstance = new ModeratorManager()
export { ModeratorManager, moderatorManagerInstance }
