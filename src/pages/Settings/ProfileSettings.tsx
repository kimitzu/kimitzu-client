import isElectron from 'is-electron'
import React, { Component, ReactNode } from 'react'

import { SideMenuWithContentCard } from '../../components/Card'
import { AddressesCardGroup } from '../../components/CardGroup'
import {
  AddressForm,
  ModeratorForm,
  ModeratorSelectionForm,
  RegistrationForm,
} from '../../components/Form'

import Axios from 'axios'
import { Button } from '../../components/Button'
import ChangeCredentials from '../../components/Card/ChangeCredentials'
import Login from '../../components/Card/Login'
import SocialMediaSettings from '../../components/Card/Settings/SocialMediaSettings'
import EducationCardGroup from '../../components/CardGroup/Settings/EducationCardGroup'
import EmploymentCardGroup from '../../components/CardGroup/Settings/EmploymentCardGroup'
import CustomDescriptionForm from '../../components/Form/CustomDescriptionForm'
import EducationForm from '../../components/Form/EducationForm'
import EmploymentForm from '../../components/Form/EmploymentForm'
import { ModeratorInfoModal } from '../../components/Modal'
import config from '../../config'
import Countries from '../../constants/Countries.json'
import CryptoCurrencies from '../../constants/CryptoCurrencies'
import CurrencyTypes from '../../constants/CurrencyTypes.json'
import FiatCurrencies from '../../constants/FiatCurrencies.json'
import Languages from '../../constants/Languages.json'
import UnitsOfMeasurement from '../../constants/UnitsOfMeasurement.json'
import Profile from '../../models/Profile'
import Settings from '../../models/Settings'
import ImageUploaderInstance from '../../utils/ImageUploaderInstance'
import NestedJsonUpdater from '../../utils/NestedJSONUpdater'

const cryptoCurrencies = CryptoCurrencies()

const actions = {
  NONE: 0,
  ADD_EDUCATION: 1,
  UPDATE_EDUCATION: 2,
  ADD_WORK: 3,
  UPDATE_WORK: 4,
  ADD_ADDRESS: 5,
  UPDATE_ADDRESS: 6,
}

interface NavContent {
  component: ReactNode
  label: string
}

// TODO: Move these interfaces if possible(duplicate interface with ListingAddUpdateCard.tsx)
interface SubNavItem {
  label: string
  handler?: () => void
}

interface NavItem extends SubNavItem {
  subItems?: SubNavItem[]
}

interface ProfileSettings {
  props: any
}

interface GeneralProfileState {
  [x: string]: any // TODO: remove this if possible
  profile: Profile
  avatar: string
  isSubmitting: boolean
  addressFormUpdateIndex: number
  educationFormUpdateIndex: number
  employmentFormUpdateIndex: number
  currentContentIndex: number
  currentParentIndex: number
  currentAction: number
  isAuthenticationActivated: boolean
  availableModerators: Profile[]
  selectedModerators: Profile[]
  originalModerators: Profile[]
  selectedModerator: Profile
  hasFetchedAModerator: boolean
  settings: Settings
}

class GeneralProfile extends Component<ProfileSettings, GeneralProfileState> {
  constructor(props: ProfileSettings) {
    super(props)
    const profile = new Profile()
    const settings = new Settings()
    this.state = {
      addressFormUpdateIndex: -1,
      educationFormUpdateIndex: -1,
      employmentFormUpdateIndex: -1,
      currentAction: actions.NONE,
      currentContentIndex: 0,
      currentParentIndex: 0,
      isSubmitting: false,
      avatar: '',
      profile,
      isAuthenticationActivated: false,
      hasFetchedAModerator: false,
      originalModerators: [],
      availableModerators: [],
      selectedModerators: [],
      selectedModerator: new Profile(),
      settings,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleSelectAddress = this.handleSelectAddress.bind(this)
    this.handleSelectAddress = this.handleSelectAddress.bind(this)
    this.handleBackBtn = this.handleBackBtn.bind(this)
    this.handleChangeAction = this.handleChangeAction.bind(this)
    this.handleProfileSave = this.handleProfileSave.bind(this)
    this.handleSelectEducation = this.handleSelectEducation.bind(this)
    this.handleSelectEmployment = this.handleSelectEmployment.bind(this)
    this.handleSelectParentItem = this.handleSelectParentItem.bind(this)
    this.mapSubcontents = this.mapSubcontents.bind(this)
    this.handleAuthenticationChange = this.handleAuthenticationChange.bind(this)
    this.handleDeactivateAuthentication = this.handleDeactivateAuthentication.bind(this)
    this.handleSubmitModeratorSelection = this.handleSubmitModeratorSelection.bind(this)
    this.handleModeratorSelection = this.handleModeratorSelection.bind(this)
    this.handleShowModeratorModal = this.handleShowModeratorModal.bind(this)
    this.handleModeratorSearch = this.handleModeratorSearch.bind(this)
  }

  public async componentDidMount() {
    try {
      const profileData = await Profile.retrieve()
      const isAuthenticationActivated = await Profile.isAuthenticationActivated()

      const settings = await Settings.retrieve()
      const moderatorProfilesRequest = settings.storeModerators.map(moderator =>
        Profile.retrieve(moderator)
      )
      const moderatorProfiles = await Promise.all(moderatorProfilesRequest)

      this.setState({
        profile: profileData,
        isAuthenticationActivated,
        settings,
        selectedModerators: moderatorProfiles,
      })
    } catch (error) {
      if (error.response) {
        if (!error.response.data.success) {
          window.location.hash = '/register'
        }
      }
    }

    const moderatorListResponse = await Axios.get(
      `${config.openBazaarHost}/ob/moderators?async=false&include=`
    )
    if (moderatorListResponse.data) {
      await moderatorListResponse.data.forEach(async (moderatorId, index) => {
        const moderator = await Profile.retrieve(moderatorId)
        const { availableModerators, originalModerators } = this.state
        this.setState({
          availableModerators: [...availableModerators, moderator],
          originalModerators: [...originalModerators, moderator],
        })
        if (index === 0) {
          this.setState({ hasFetchedAModerator: true })
        }
      })
    }
  }

  get mainContents() {
    const { avatar, isSubmitting, profile: registrationForm } = this.state
    const { handleChange, handleFormSubmit, handleSelectAddress, handleChangeAction } = this

    const security = [
      {
        component: (
          <div className="uk-flex uk-flex-row uk-child-width-1-2">
            <div>
              <ChangeCredentials onSubmit={this.handleAuthenticationChange} />
            </div>
            <div className="uk-margin-left">
              <p>
                Enabling this feature will activate Djali's authentication mechanisms to protect
                your client from unauthorized access.
              </p>
              <p className="uk-margin-top">
                Other non-critical features such as search will still be accessible but payment and
                ordering-related features will need authentication in order to proceed.
              </p>
            </div>
          </div>
        ),
        label: 'Authentication',
      },
    ]

    if (this.state.isAuthenticationActivated) {
      security.push({
        component: (
          <div className="uk-flex uk-flex-row uk-child-width-1-2">
            <div>
              <Login
                onSubmit={this.handleDeactivateAuthentication}
                submitLabel={'Deactivate Authentication'}
              />
            </div>
            <div className="uk-margin-left">
              <p>
                Enabling this feature will deactivate Djali's authentication mechanisms and your
                client will no longer be protected from unauthorized access.
              </p>
              <p className="uk-margin-top">
                Payment and ordering-related features will no longer need authentication in order to
                proceed.
              </p>
            </div>
          </div>
        ),
        label: 'Deactivate',
      })
    }

    return [
      [
        {
          component: (
            <div className="uk-width-1-1">
              <RegistrationForm
                availableCountries={Countries}
                cryptoCurrencies={cryptoCurrencies}
                currencyTypes={CurrencyTypes}
                fiatCurrencies={FiatCurrencies}
                languages={Languages}
                unitOfMeasurements={UnitsOfMeasurement}
                data={registrationForm}
                onChange={handleChange}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                avatar={avatar}
              />
            </div>
          ),
          label: 'General',
        },
        {
          component: (
            <div>
              <SocialMediaSettings profile={this.state.profile} />
              <Button
                className="uk-button uk-button-primary uk-align-center"
                onClick={handleFormSubmit}
                showSpinner={isSubmitting}
              >
                Save
              </Button>
            </div>
          ),
          label: 'Social Media',
        },
        {
          component: (
            <div className="uk-width-1-1">
              <EducationCardGroup
                profile={this.state.profile}
                handleAddBtn={() => {
                  handleChangeAction(actions.ADD_EDUCATION)
                }}
                handleSelectEducation={this.handleSelectEducation}
              />
            </div>
          ),
          label: 'Education',
        },
        {
          component: (
            <div className="uk-width-1-1">
              <EmploymentCardGroup
                profile={this.state.profile}
                handleAddBtn={() => {
                  handleChangeAction(actions.ADD_WORK)
                }}
                handleSelectEmployment={this.handleSelectEmployment}
              />
            </div>
          ),
          label: 'Work History',
        },
        {
          component: (
            <AddressesCardGroup
              handleAddAddressBtn={() => handleChangeAction(actions.ADD_ADDRESS)}
              handleSelectAddress={handleSelectAddress}
              locations={registrationForm.extLocation.addresses}
            />
          ),
          label: 'Addresses',
        },
        {
          component: <CustomDescriptionForm profile={this.state.profile} />,
          label: 'Custom Descriptions',
        },
      ],
      [
        {
          component: <ModeratorForm profile={this.state.profile} />,
          label: 'General',
        },
      ],
      [
        {
          component: (
            <ModeratorSelectionForm
              availableModerators={this.state.availableModerators}
              selectedModerators={this.state.selectedModerators}
              handleBtnClick={this.handleModeratorSelection}
              handleSubmit={this.handleSubmitModeratorSelection}
              handleModeratorSearch={this.handleModeratorSearch}
              handleMoreInfo={this.handleShowModeratorModal}
              showSpinner={!this.state.hasFetchedAModerator}
              submitLabel={'Save'}
            />
          ),
          label: 'Moderators',
        },
      ],
      security,
    ]
  }

  get subContents() {
    const { addressFormUpdateIndex } = this.state
    return {
      [actions.ADD_EDUCATION]: {
        component: (
          <EducationForm
            key="addEducationForm"
            isEdit={false}
            updateIndex={this.state.educationFormUpdateIndex}
            profile={this.state.profile}
            handleProfileSave={this.handleProfileSave}
          />
        ),
        label: 'ADD EDUCATION',
      },
      [actions.UPDATE_EDUCATION]: {
        component: (
          <EducationForm
            key="updateEducationForm"
            isEdit
            updateIndex={this.state.educationFormUpdateIndex}
            profile={this.state.profile}
            handleProfileSave={this.handleProfileSave}
          />
        ),
        label: 'UPDATE EDUCATION',
      },
      [actions.ADD_WORK]: {
        component: (
          <EmploymentForm
            key="addWorkForm"
            isEdit={false}
            updateIndex={this.state.employmentFormUpdateIndex}
            profile={this.state.profile}
            handleProfileSave={this.handleProfileSave}
          />
        ),
        label: 'ADD WORK',
      },
      [actions.UPDATE_WORK]: {
        component: (
          <EmploymentForm
            key="updateWorkForm"
            isEdit
            updateIndex={this.state.employmentFormUpdateIndex}
            profile={this.state.profile}
            handleProfileSave={this.handleProfileSave}
          />
        ),
        label: 'UPDATE WORK',
      },
      [actions.ADD_ADDRESS]: {
        component: (
          <AddressForm
            key="addAddressForm"
            handleSave={async location => {
              this.state.profile.updateAddresses(location)
              await this.handleProfileSave()
            }}
          />
        ),
        label: 'ADD ADDRESS',
      },
      [actions.UPDATE_ADDRESS]: {
        component: (
          <AddressForm
            key="updateAddressForm"
            updateIndex={addressFormUpdateIndex}
            data={this.state.profile.extLocation.addresses[addressFormUpdateIndex]}
            handleSave={async (location, index) => {
              this.state.profile.updateAddresses(location, index)
              await this.handleProfileSave()
            }}
            handleDelete={async (location, index) => {
              this.state.profile.deleteAddress(index)
              await this.handleProfileSave()
            }}
          />
        ),
        label: 'UPDATE ADDRESS',
      },
    }
  }

  get navItems() {
    const { mapSubcontents, handleSelectParentItem } = this
    const navItems: NavItem[] = [
      {
        label: 'Profile',
        handler: () => handleSelectParentItem(0),
        subItems: mapSubcontents(0),
      },
      {
        label: 'Moderation',
        handler: () => handleSelectParentItem(1),
        subItems: mapSubcontents(1),
      },
      {
        label: 'Store',
        handler: () => handleSelectParentItem(2),
        subItems: mapSubcontents(2),
      },
      {
        label: 'Security',
        handler: () => handleSelectParentItem(3),
        subItems: mapSubcontents(3),
      },
    ]
    return navItems
  }

  get currentCardContent() {
    const { currentAction, currentParentIndex, currentContentIndex } = this.state
    return currentAction === actions.NONE
      ? this.mainContents[currentParentIndex][currentContentIndex]
      : this.subContents[currentAction]
  }

  public render() {
    const { currentCardContent, handleBackBtn, navItems } = this
    const { currentAction } = this.state
    return (
      <div className="background-body min-full-vh uk-padding-small">
        <SideMenuWithContentCard
          mainContentTitle={currentCardContent.label}
          menuContent={{
            title: 'SETTINGS',
            navItems,
          }}
          mainContent={currentCardContent.component}
          handleBackBtn={handleBackBtn}
          showBackBtn={currentAction !== actions.NONE}
        />
        <ModeratorInfoModal profile={this.state.selectedModerator} />
      </div>
    )
  }

  private async handleAuthenticationChange(
    oldUsername: string,
    oldPassword: string,
    newUsername: string,
    newPassword: string
  ) {
    try {
      await Profile.setCredentials(oldUsername, oldPassword, newUsername, newPassword)
      Profile.logout()
      window.UIkit.notification(
        'New credentials accepted!\nPlease restart the server for changes to take effect.',
        {
          status: 'success',
        }
      )

      setTimeout(() => {
        if (isElectron()) {
          const remote = window.remote
          const currentWindow = remote.getCurrentWindow()
          const { webContents } = currentWindow
          webContents.clearHistory()
        }
        window.location.hash = '/'
        window.location.reload()
      }, 5000)
    } catch (e) {
      window.UIkit.notification(e.response.data.error, { status: 'danger' })
    }
  }

  private async handleDeactivateAuthentication(username: string, password: string) {
    try {
      await Profile.deleteCredentials(username, password)
      Profile.logout()
      window.UIkit.notification(
        'Credentials successfully deleted!\nPlease restart the server for changes to take effect.',
        { status: 'success' }
      )
      setTimeout(() => {
        window.location.hash = '/login'
      }, 5000)
    } catch (e) {
      window.UIkit.notification(e.response.data.error, { status: 'danger' })
    }
  }

  private mapSubcontents(parentIndex: number) {
    return this.mainContents[parentIndex]!.map((subItem: NavContent, index: number) => {
      return {
        label: subItem.label,
        handler: () => {
          this.setState({ currentContentIndex: index, currentAction: actions.NONE })
        },
      }
    })
  }

  private handleSelectParentItem(index: number) {
    this.setState({
      currentParentIndex: index,
      currentContentIndex: 0,
      currentAction: actions.NONE,
    })
  }

  private handleChangeAction(action: number) {
    this.setState({ currentAction: action })
  }

  private handleBackBtn() {
    this.setState({ currentAction: actions.NONE })
  }

  private handleSelectAddress(addressIndex: number) {
    const { profile: registrationForm } = this.state
    this.setState({
      currentAction: actions.UPDATE_ADDRESS,
      addressForm: registrationForm.extLocation.addresses[addressIndex],
      addressFormUpdateIndex: addressIndex,
    })
  }

  private handleSelectEducation(educationIndex: number) {
    this.setState({
      currentAction: actions.UPDATE_EDUCATION,
      educationFormUpdateIndex: educationIndex,
    })
  }

  private handleSelectEmployment(educationIndex: number) {
    this.setState({
      currentAction: actions.UPDATE_WORK,
      employmentFormUpdateIndex: educationIndex,
    })
  }

  private async handleFormSubmit(event: React.FormEvent) {
    event.preventDefault()

    this.setState({
      isSubmitting: true,
    })

    if (this.state.avatar) {
      const avatarHashes = await ImageUploaderInstance.uploadImage(this.state.avatar)
      this.state.profile.avatarHashes = avatarHashes
    }

    await this.state.profile.update()
    window.UIkit.notification('Profile updated', { status: 'success' })
    this.setState({
      isSubmitting: false,
    })
  }

  private async handleChange(field: string, value: any, parentField?: string): Promise<any> {
    if (field === 'avatar') {
      const base64ImageStr = await ImageUploaderInstance.convertToBase64(value[0])
      value = base64ImageStr
    }

    if (parentField) {
      const subFieldData = this.state[parentField]
      NestedJsonUpdater(subFieldData, field, value)
      this.setState({ subFieldData })
    } else {
      this.setState({
        [field]: value,
      })
    }
  }

  private async handleProfileSave() {
    await this.state.profile.update()
    window.UIkit.notification('Profile saved', { status: 'success' })
    this.setState({
      currentAction: actions.NONE,
    })
  }

  private handleModeratorSelection(moderator: Profile, index: number, type) {
    const { availableModerators, selectedModerators } = this.state
    if (type === 'add') {
      availableModerators.splice(index, 1)
      selectedModerators.push(moderator)
    } else if (type === 'remove') {
      selectedModerators.splice(index, 1)
      availableModerators.push(moderator)
    }
    this.setState({ availableModerators, selectedModerators })
  }

  private async handleSubmitModeratorSelection() {
    this.state.settings.storeModerators = this.state.selectedModerators.map(
      moderator => moderator.peerID
    )
    try {
      await this.state.settings.save()
      window.UIkit.notification('Moderators saved', { status: 'success' })
    } catch (e) {
      window.UIkit.notification(e.message, { status: 'danger' })
    }
  }

  private handleShowModeratorModal(moderator: Profile) {
    this.setState({ selectedModerator: moderator })
    const moderatorModal = window.UIkit.modal('#moderator-info')
    if (moderatorModal) {
      moderatorModal.show()
    }
  }

  private async handleModeratorSearch(searchStr: string) {
    if (!searchStr) {
      this.setState({
        availableModerators: this.state.originalModerators,
      })
      return
    }

    if (this.state.availableModerators.length > 0) {
      const filteredMods = this.state.availableModerators.filter(mod => {
        return mod.peerID.includes(searchStr)
      })
      this.setState({
        availableModerators: filteredMods,
      })
      return
    }

    if (searchStr.length < 46) {
      return
    }

    const retrievedProfile = await Profile.retrieve(searchStr, true)
    const isAlreadySelected = this.state.selectedModerators.some(
      moderator => moderator.peerID === retrievedProfile.peerID
    )
    if (retrievedProfile.moderator && !isAlreadySelected) {
      this.setState({
        availableModerators: [retrievedProfile],
      })
    }
  }
}

export default GeneralProfile
