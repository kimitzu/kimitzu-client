import isElectron from 'is-electron'
import React, { Component, ReactNode } from 'react'

import { Accordion } from '../../components/Accordion'
import { Button } from '../../components/Button'
import { SideMenuWithContentCard } from '../../components/Card'
import { AddressesCardGroup } from '../../components/CardGroup'
import {
  AddressForm,
  ModeratorForm,
  ModeratorSelectionForm,
  RegistrationForm,
  TagsForm,
} from '../../components/Form'
import { ModeratorInfoModal } from '../../components/Modal'
import { RoundSelector } from '../../components/Selector/RoundSelector'
import { webSocketResponsesInstance } from '../../models/WebsocketResponses'

import ChangeCredentials from '../../components/Card/ChangeCredentials'
import Login from '../../components/Card/Login'
import SocialMediaSettings from '../../components/Card/Settings/SocialMediaSettings'
import EducationCardGroup from '../../components/CardGroup/Settings/EducationCardGroup'
import EmploymentCardGroup from '../../components/CardGroup/Settings/EmploymentCardGroup'
import DropdownSearchCompetency from '../../components/Dropdown/DropdownSearchCompetency'
import CustomDescriptionForm from '../../components/Form/CustomDescriptionForm'
import EducationForm from '../../components/Form/EducationForm'
import EmploymentForm from '../../components/Form/EmploymentForm'
import CompetencySelector from '../../components/Selector/CompetencySelector/CompetencySelector'
import { CircleSpinner } from '../../components/Spinner'
import CryptoCurrencies from '../../constants/CryptoCurrencies'
import CurrencyTypes from '../../constants/CurrencyTypes.json'
import FiatCurrencies from '../../constants/FiatCurrencies.json'
import Languages from '../../constants/Languages.json'
import UnitsOfMeasurement from '../../constants/UnitsOfMeasurement.json'
import {
  AssessmentSummary,
  competencySelectorInstance,
  CompetencySelectorModel,
} from '../../models/CompetencySelector'
import Profile from '../../models/Profile'
import Settings from '../../models/Settings'
import ImageUploaderInstance from '../../utils/ImageUploaderInstance'
import NestedJsonUpdater from '../../utils/NestedJSONUpdater'
import decodeHtml from '../../utils/Unescape'

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
  skills: string[]
  availableModerators: Profile[]
  selectedModerators: Profile[]
  originalModerators: Profile[]
  selectedModerator: Profile
  hasFetchedAModerator: boolean
  settings: Settings
  competencySelector: CompetencySelectorModel
  searhCompQuery: string
  showTest: boolean
  selectedCompetency: any
  currentCompetencyId: string
  isLoading: boolean
}

class GeneralProfile extends Component<ProfileSettings, GeneralProfileState> {
  constructor(props: ProfileSettings) {
    super(props)
    const profile = new Profile()
    const settings = new Settings()
    this.state = {
      addressFormUpdateIndex: -1,
      availableModerators: [],
      avatar: '',
      competencySelector: competencySelectorInstance,
      currentAction: actions.NONE,
      currentCompetencyId: '',
      currentContentIndex: 0,
      currentParentIndex: 0,
      educationFormUpdateIndex: -1,
      employmentFormUpdateIndex: -1,
      hasFetchedAModerator: false,
      isAuthenticationActivated: false,
      isLoading: true,
      isSubmitting: false,
      originalModerators: [],
      profile,
      seachResultComp: [],
      searhCompQuery: '',
      selectedCompetency: [],
      selectedModerator: new Profile(),
      selectedModerators: [],
      settings,
      showTest: false,
      skills: [],
    }

    this.handleAuthenticationChange = this.handleAuthenticationChange.bind(this)
    this.handleBackBtn = this.handleBackBtn.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeAction = this.handleChangeAction.bind(this)
    this.handleCompetencyDelete = this.handleCompetencyDelete.bind(this)
    this.handleCompetencyReset = this.handleCompetencyReset.bind(this)
    this.handleCompetencySubmit = this.handleCompetencySubmit.bind(this)
    this.handleDeactivateAuthentication = this.handleDeactivateAuthentication.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleModeratorSearch = this.handleModeratorSearch.bind(this)
    this.handleModeratorSelection = this.handleModeratorSelection.bind(this)
    this.handleProfileSave = this.handleProfileSave.bind(this)
    this.handleRoundSelector = this.handleRoundSelector.bind(this)
    this.handleSelectAddress = this.handleSelectAddress.bind(this)
    this.handleSelectAddress = this.handleSelectAddress.bind(this)
    this.handleSelectEducation = this.handleSelectEducation.bind(this)
    this.handleSelectEmployment = this.handleSelectEmployment.bind(this)
    this.handleSelectParentItem = this.handleSelectParentItem.bind(this)
    this.handleShowModeratorModal = this.handleShowModeratorModal.bind(this)
    this.handleSubmitModeratorSelection = this.handleSubmitModeratorSelection.bind(this)
    this.mapSubcontents = this.mapSubcontents.bind(this)
    this.searchCompetency = this.searchCompetency.bind(this)
    this.selectCompetencyDropdown = this.selectCompetencyDropdown.bind(this)
    this.showTest = this.showTest.bind(this)
    this.toggleCompetency = this.toggleCompetency.bind(this)
  }

  public async componentDidMount() {
    try {
      const profileData = await Profile.retrieve()

      if (!profileData.customProps.programmerCompetency) {
        profileData.customProps.programmerCompetency = '{}'
      }

      if (!profileData.customProps.skills) {
        profileData.customProps.skills = '[]'
      }

      const competency = JSON.parse(decodeHtml(profileData.customProps.programmerCompetency))
      const skills = JSON.parse(decodeHtml(profileData.customProps.skills))
      const isAuthenticationActivated = await Profile.isAuthenticationActivated()
      const settings = await Settings.retrieve()

      const competencySelector = this.state.competencySelector.load(profileData.customProps
        .competencies as AssessmentSummary)

      this.setState({
        competencySelector,
        competency: { ...this.state.competency, ...competency },
        skills,
        profile: profileData,
        isAuthenticationActivated,
        settings,
      })

      setTimeout(async () => {
        const moderatorProfilesRequest = settings.storeModerators.map(moderator =>
          Profile.retrieve(moderator)
        )
        const moderatorProfiles = await Promise.all(moderatorProfilesRequest)
        this.setState({
          selectedModerators: moderatorProfiles,
        })
      })
    } catch (error) {
      if (error.response) {
        if (!error.response.data.success) {
          window.location.hash = '/register'
        }
      }
    }

    const moderatorListResponse = { data: webSocketResponsesInstance.moderatorIDs }

    if (moderatorListResponse.data) {
      moderatorListResponse.data.forEach(async (moderatorId, index) => {
        let moderator
        try {
          moderator = await Profile.retrieve(moderatorId)
        } catch (e) {
          return
        }
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

    this.setState({
      isLoading: false,
    })
  }

  public toggleCompetency(i) {
    const cmp = this.state.competencySelector.competencies
    const competencySelector = this.state.competencySelector.setCompetencyCheck(i, !cmp[i].checked)
    this.setState({
      competencySelector,
      seachResultComp: [],
      searhCompQuery: '',
    })
  }

  public searchCompetency(query) {
    const cmp = this.state.competencySelector.competencies
    const regex = new RegExp(`^${query}`, 'i')
    const result = cmp.filter(obj => regex.test(obj.title) && obj.checked === false)
    this.setState({ seachResultComp: result, searhCompQuery: query })
  }

  public selectCompetencyDropdown(id) {
    const cmp = this.state.competencySelector.competencies
    const i = cmp.findIndex(el => el.id === id)
    const competencySelector = this.state.competencySelector.setCompetencyCheck(i, true)
    this.setState({
      competencySelector,
      seachResultComp: [],
      searhCompQuery: '',
    })
  }

  public showTest(index, id: string) {
    this.setState({
      currentCompetencyId: id,
    })

    const cs = this.state.competencySelector
    const compTemp = cs.competencies[index]
    const skills = compTemp.matrix.map((c, i) => {
      return {
        title: c.category,
        component: (
          <RoundSelector
            handleSelect={this.handleRoundSelector}
            id={compTemp.id}
            compIndex={index}
            matrixIndex={i}
            competency={this.state.competencySelector}
          />
        ),
      }
    })
    this.setState({ competencySelector: cs, selectedCompetency: skills, showTest: true })
  }

  public handleRoundSelector(compIndex, matrixIndex, subIndex, index) {
    const compTemp = this.state.competencySelector
    if (
      compTemp.competencies[compIndex].matrix[matrixIndex].subCategories[subIndex].assessment !==
      index
    ) {
      compTemp.competencies[compIndex].matrix[matrixIndex].subCategories[
        subIndex
      ].assessment = index
    } else {
      compTemp.competencies[compIndex].matrix[matrixIndex].subCategories[subIndex].assessment = -1
    }
    this.showTest(compIndex, compTemp.competencies[compIndex].id)
    this.setState({ competencySelector: compTemp })
  }

  public handleCompetencyReset() {
    const competencies = this.state.competency
    const mainCategories = Object.keys(competencies)
    mainCategories.forEach(mainCategory => {
      const subCategories = Object.keys(competencies[mainCategory])
      subCategories.forEach(subCategory => {
        competencies[mainCategory][subCategory] = -1
      })
    })
    this.setState({
      competency: competencies,
    })
    window.UIkit.notification(`Competencies cleared.<br/>Don't forget to save your changes.`, {
      status: 'success',
    })
  }

  public async handleCompetencyDelete() {
    this.setState({
      isSubmitting: true,
    })
    const id = this.state.currentCompetencyId
    delete this.state.profile.customProps.competencies[id]
    competencySelectorInstance.delete(id)
    await this.state.profile.update()
    window.UIkit.notification(`Competency Deleted!`, {
      status: 'success',
    })
    this.setState({
      isSubmitting: false,
      showTest: false,
    })
  }

  public async handleCompetencySubmit() {
    this.setState({
      isSubmitting: true,
    })
    const competencies = { ...(this.state.profile.customProps.competencies as AssessmentSummary) }
    const assessment = competencySelectorInstance.generateAssessmentSummary(
      this.state.currentCompetencyId
    )
    competencies[this.state.currentCompetencyId] = assessment
    this.state.profile.customProps.competencies = competencies
    await this.state.profile.update()
    this.setState({
      isSubmitting: false,
      profile: this.state.profile,
    })
    window.UIkit.notification('Competency Updated', { status: 'success' })
  }

  get mainContents() {
    const { avatar, isSubmitting, profile: registrationForm, competency } = this.state
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
      [
        {
          component: (
            <div className="uk-margin-bottom uk-width-1-1">
              <TagsForm
                tags={this.state.skills}
                formLabel={'SKILLS'}
                submitLabel={'SAVE'}
                onSubmit={async (tags: string[]) => {
                  this.setState({
                    skills: tags,
                  })
                  this.state.profile.customProps.skills = JSON.stringify(tags)
                  try {
                    await this.state.profile.update()
                    window.UIkit.notification('Skills saved!', {
                      status: 'success',
                    })
                  } catch (e) {
                    window.UIkit.notification('Error saving: ' + e.message, {
                      status: 'danger',
                    })
                  }
                }}
              />
            </div>
          ),
          label: 'General',
        },
        {
          component: (
            <div id="programming-competency-cont">
              {this.state.showTest ? (
                <div>
                  <span
                    uk-icon="icon: arrow-left; ratio: 1.5"
                    className="color-primary cursor-pointer"
                    onClick={() => {
                      this.setState({
                        showTest: false,
                      })
                    }}
                  />
                  <div>
                    <Accordion content={this.state.selectedCompetency} />
                  </div>
                  <div className="uk-flex uk-flex-row uk-flex-center uk-margin-top">
                    <Button
                      className="uk-button uk-button-danger uk-margin-right"
                      onClick={this.handleCompetencyDelete}
                      showSpinner={this.state.isSubmitting}
                    >
                      Delete
                    </Button>
                    <Button
                      className="uk-button uk-button-primary"
                      onClick={this.handleCompetencySubmit}
                      showSpinner={this.state.isSubmitting}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <DropdownSearchCompetency
                    checker={this.selectCompetencyDropdown}
                    competencies={this.state.competencySelector.competencies}
                    searchChange={this.searchCompetency}
                    searchResults={this.state.seachResultComp}
                    val={this.state.searhCompQuery}
                  />
                  <CompetencySelector
                    checker={this.toggleCompetency}
                    competencies={this.state.competencySelector.competencies}
                    showTest={this.showTest}
                  />
                </>
              )}
            </div>
          ),
          label: 'Competencies',
        },
      ],
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
      {
        label: 'Skills',
        handler: () => handleSelectParentItem(4),
        subItems: mapSubcontents(4),
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
    if (this.state.isLoading) {
      return (
        <div className="uk-flex uk-flex-row uk-flex-center">
          <div className="uk-margin-top">
            <CircleSpinner message="Loading Profile..." />
          </div>
        </div>
      )
    }

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
