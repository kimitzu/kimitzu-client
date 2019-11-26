import isElectron from 'is-electron'
import React, { Component, ReactNode } from 'react'

import { Accordion } from '../../components/Accordion'
import { Button } from '../../components/Button'
import { SideMenuWithContentCard } from '../../components/Card'
import { AddressesCardGroup } from '../../components/CardGroup'
import {
  AddressForm,
  MiscSettingsForm,
  ModeratorForm,
  ModeratorSelectionForm,
  RegistrationForm,
  TagsForm,
} from '../../components/Form'
import { ModeratorInfoModal } from '../../components/Modal'
import { RoundSelector } from '../../components/Selector/RoundSelector'

import ChangeCredentials from '../../components/Card/ChangeCredentials'
import Login from '../../components/Card/Login'
import BlockedPeersCard from '../../components/Card/Settings/BlockedPeersCard'
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
import { localeInstance } from '../../i18n'
import {
  AssessmentSummary,
  competencySelectorInstance,
  CompetencySelectorModel,
} from '../../models/CompetencySelector'
import { ModeratorManager, moderatorManagerInstance } from '../../models/ModeratorManager'
import Profile from '../../models/Profile'
import Settings from '../../models/Settings'
import ImageUploaderInstance from '../../utils/ImageUploaderInstance'
import NestedJsonUpdater from '../../utils/NestedJSONUpdater'
import decodeHtml from '../../utils/Unescape'

const cryptoCurrencies = CryptoCurrencies()

const subContentActions = {
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

interface GeneralProfileProps {
  profileContext: {
    currentUser: Profile
    settings: Settings
    updateCurrentUser: (profile: Profile) => void
  }
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
  moderatorManager: ModeratorManager
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

class GeneralProfile extends Component<GeneralProfileProps, GeneralProfileState> {
  private debounce = 0
  private locale = localeInstance.get.localizations

  constructor(props: GeneralProfileProps) {
    super(props)
    const profile = props.profileContext.currentUser
    const settings = new Settings()
    this.state = {
      addressFormUpdateIndex: -1,
      moderatorManager: moderatorManagerInstance,
      avatar: '',
      competencySelector: competencySelectorInstance,
      currentAction: subContentActions.NONE,
      currentCompetencyId: '',
      currentContentIndex: 0,
      currentParentIndex: 0,
      educationFormUpdateIndex: -1,
      employmentFormUpdateIndex: -1,
      hasFetchedAModerator: false,
      isAuthenticationActivated: false,
      isLoading: true,
      isSubmitting: false,
      profile,
      seachResultComp: [],
      searhCompQuery: '',
      selectedCompetency: [],
      selectedModerator: new Profile(),
      settings,
      showTest: false,
      skills: [],
    }

    this.handleAuthenticationChange = this.handleAuthenticationChange.bind(this)
    this.handleBackBtn = this.handleBackBtn.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeAction = this.handleChangeAction.bind(this)
    this.handleCompetencyDelete = this.handleCompetencyDelete.bind(this)
    this.handleCompetencySubmit = this.handleCompetencySubmit.bind(this)
    this.handleDeactivateAuthentication = this.handleDeactivateAuthentication.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleModeratorSearch = this.handleModeratorSearch.bind(this)
    this.handleProfileSave = this.handleProfileSave.bind(this)
    this.handleRoundSelector = this.handleRoundSelector.bind(this)
    this.handleSelectAddress = this.handleSelectAddress.bind(this)
    this.handleSelectAddress = this.handleSelectAddress.bind(this)
    this.handleSelectEducation = this.handleSelectEducation.bind(this)
    this.handleSelectEmployment = this.handleSelectEmployment.bind(this)
    this.handleSelectParentItem = this.handleSelectParentItem.bind(this)
    this.handleShowModeratorModal = this.handleShowModeratorModal.bind(this)
    this.handleSubmitModeratorSelection = this.handleSubmitModeratorSelection.bind(this)
    this.handleModeratorSelect = this.handleModeratorSelect.bind(this)
    this.handleModeratorRemove = this.handleModeratorRemove.bind(this)
    this.mapSubcontents = this.mapSubcontents.bind(this)
    this.searchCompetency = this.searchCompetency.bind(this)
    this.selectCompetencyDropdown = this.selectCompetencyDropdown.bind(this)
    this.showTest = this.showTest.bind(this)
    this.toggleCompetency = this.toggleCompetency.bind(this)
  }

  public async componentDidMount() {
    this.locale = localeInstance.get.localizations

    try {
      const profileData = this.props.profileContext.currentUser
      if (!profileData.customProps.programmerCompetency) {
        profileData.customProps.programmerCompetency = '{}'
      }

      if (!profileData.customProps.skills) {
        profileData.customProps.skills = '[]'
      }

      const competency = JSON.parse(decodeHtml(profileData.customProps.programmerCompetency))
      const skills = JSON.parse(decodeHtml(profileData.customProps.skills))
      const isAuthenticationActivated = await Profile.isAuthenticationActivated()
      const settings = this.props.profileContext.settings
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
    } catch (error) {
      if (error.response) {
        if (!error.response.data.success) {
          window.location.hash = '/register'
        }
      }
    }

    moderatorManagerInstance.selectedModerators = [...moderatorManagerInstance.favoriteModerators]

    this.setState({
      isLoading: false,
      hasFetchedAModerator: true,
      moderatorManager: moderatorManagerInstance,
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
    const competency = this.state.competencySelector.competencies
    const index = competency.findIndex(element => element.id === id)
    const competencySelector = this.state.competencySelector.setCompetencyCheck(index, true)
    this.setState({
      competencySelector,
      seachResultComp: [],
      searhCompQuery: '',
    })
  }

  public showTest(index: number, id: string) {
    this.setState({
      currentCompetencyId: id,
    })

    const cs = this.state.competencySelector
    const compTemp = cs.competencies[index]
    const skills = compTemp.matrix.map((competency, loopIndex) => {
      return {
        title: competency.category,
        component: (
          <RoundSelector
            handleSelect={this.handleRoundSelector}
            id={compTemp.id}
            compIndex={index}
            matrixIndex={loopIndex}
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

  public async handleCompetencyDelete() {
    this.setState({
      isSubmitting: true,
    })
    const id = this.state.currentCompetencyId
    delete this.state.profile.customProps.competencies[id]
    competencySelectorInstance.delete(id)
    await this.handleProfileUpdate()
    window.UIkit.notification(this.locale.settingsPage.competencyDeleteSuccessNotif, {
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
    await this.handleProfileUpdate()
    this.setState({
      isSubmitting: false,
      profile: this.state.profile,
    })
    window.UIkit.notification(this.locale.settingsPage.competencyUpdateSuccessNotif, {
      status: 'success',
    })
  }

  get mainContents() {
    const { avatar, isSubmitting, profile: registrationForm, competency } = this.state
    const { handleChange, handleFormSubmit, handleSelectAddress, handleChangeAction } = this
    const {
      locale,
      locale: { settingsPage },
    } = this
    const securityComponent = [
      {
        component: (
          <div className="uk-flex uk-flex-row uk-child-width-1-2 uk-margin-bottom">
            <div>
              <ChangeCredentials onSubmit={this.handleAuthenticationChange} />
            </div>
            <div className="uk-margin-left">
              <p>{settingsPage.changeCredMsgTextA}</p>
              <p className="uk-margin-top">{this.locale.settingsPage.changeCredMsgTextB}</p>
            </div>
          </div>
        ),
        label: settingsPage.authenticationText,
      },
    ]

    if (this.state.isAuthenticationActivated) {
      securityComponent.push({
        component: (
          <div className="uk-flex uk-flex-row uk-child-width-1-2 uk-margin-bottom">
            <div>
              <Login
                onSubmit={this.handleDeactivateAuthentication}
                submitLabel={settingsPage.deactivateAuthForm.submitBtnText}
              />
            </div>
            <div className="uk-margin-left">
              <p>{settingsPage.deactivateAuthForm.helper1}</p>
              <p className="uk-margin-top">{settingsPage.deactivateAuthForm.helper2}</p>
            </div>
          </div>
        ),
        label: settingsPage.securityNavItems.deactivate,
      })
    }

    const registrationFormComponent = {
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
            submitButtonLabel={this.locale.saveBtnText}
          />
        </div>
      ),
      label: settingsPage.generalNavItem,
    }

    const socialMediaComponent = {
      component: (
        <div>
          <SocialMediaSettings profile={this.state.profile} />
          <Button
            className="uk-button uk-button-primary uk-align-center"
            onClick={handleFormSubmit}
            showSpinner={isSubmitting}
          >
            {locale.saveBtnText}
          </Button>
        </div>
      ),
      label: settingsPage.profileNavItems.socialMedia,
    }

    const educationHistoryComponent = {
      component: (
        <div className="uk-width-1-1">
          <EducationCardGroup
            profile={this.state.profile}
            handleAddBtn={() => {
              handleChangeAction(subContentActions.ADD_EDUCATION)
            }}
            handleSelectEducation={this.handleSelectEducation}
          />
        </div>
      ),
      label: settingsPage.profileNavItems.education,
    }

    const employmentHistoryComponent = {
      component: (
        <div className="uk-width-1-1">
          <EmploymentCardGroup
            profile={this.state.profile}
            handleAddBtn={() => {
              handleChangeAction(subContentActions.ADD_WORK)
            }}
            handleSelectEmployment={this.handleSelectEmployment}
          />
        </div>
      ),
      label: settingsPage.profileNavItems.workHistory,
    }

    const addressesComponent = {
      component: (
        <AddressesCardGroup
          handleAddAddressBtn={() => handleChangeAction(subContentActions.ADD_ADDRESS)}
          handleSelectAddress={handleSelectAddress}
          locations={registrationForm.extLocation.addresses}
        />
      ),
      label: settingsPage.profileNavItems.addresses,
    }

    const customDescriptionComponent = {
      component: <CustomDescriptionForm profile={this.state.profile} />,
      label: settingsPage.profileNavItems.customDescriptions,
    }

    const enableModeratorFormComponent = {
      component: <ModeratorForm profile={this.state.profile} />,
      label: settingsPage.generalNavItem,
    }

    const storeModeratorSelectionComponent = {
      component: (
        <ModeratorSelectionForm
          moderatorManager={this.state.moderatorManager}
          hideFavorites
          handleSelectModerator={this.handleModeratorSelect}
          handleRemoveModerator={this.handleModeratorRemove}
          handleSubmit={this.handleSubmitModeratorSelection}
          handleModeratorSearch={this.handleModeratorSearch}
          handleMoreInfo={this.handleShowModeratorModal}
          showSpinner={!this.state.hasFetchedAModerator}
          submitLabel={this.locale.saveBtnText}
        />
      ),
      label: settingsPage.favoriteModeratorsNavItem,
    }

    const skillsComponent = {
      component: (
        <div className="uk-margin-bottom uk-width-1-1">
          <TagsForm
            tags={this.state.skills}
            formLabel={this.locale.skillsText.toUpperCase()}
            submitLabel={this.locale.saveBtnText.toUpperCase()}
            onSubmit={async (tags: string[]) => {
              this.setState({
                skills: tags,
              })
              this.state.profile.customProps.skills = JSON.stringify(tags)
              try {
                await this.handleProfileUpdate()
                window.UIkit.notification(settingsPage.saveSkillsSuccessNotif, {
                  status: 'success',
                })
              } catch (e) {
                window.UIkit.notification(`${settingsPage.saveSkillsErrorNotif}: ${e.message}`, {
                  status: 'danger',
                })
              }
            }}
          />
        </div>
      ),
      label: this.locale.settingsPage.generalNavItem,
    }

    const competenciesComponent = {
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
                  {locale.deleteBtnText}
                </Button>
                <Button
                  className="uk-button uk-button-primary"
                  onClick={this.handleCompetencySubmit}
                  showSpinner={this.state.isSubmitting}
                >
                  {locale.saveBtnText}
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
      label: this.locale.competenciesText,
    }

    const otherSettings = [
      {
        component: (
          <div className="uk-margin-bottom uk-width-1-1">
            <BlockedPeersCard settings={this.state.settings} />
          </div>
        ),
        label: settingsPage.othersNavItems.blockedPeers,
      },
    ]

    if (isElectron()) {
      otherSettings.push({
        component: <MiscSettingsForm />,
        label: settingsPage.otherNavItems.miscellaneous,
      })
    }

    return [
      [
        registrationFormComponent,
        socialMediaComponent,
        educationHistoryComponent,
        employmentHistoryComponent,
        addressesComponent,
        customDescriptionComponent,
      ],
      [enableModeratorFormComponent],
      [storeModeratorSelectionComponent],
      securityComponent,
      [skillsComponent, competenciesComponent],
      otherSettings,
    ]
  }

  get subContents() {
    const { addressFormUpdateIndex } = this.state
    const { addressForm, settingsPage } = this.locale
    return {
      [subContentActions.ADD_EDUCATION]: {
        component: (
          <EducationForm
            key="addEducationForm"
            isEdit={false}
            updateIndex={this.state.educationFormUpdateIndex}
            profile={this.state.profile}
            handleProfileSave={this.handleProfileSave}
          />
        ),
        label: settingsPage.educationForm.addBtnText.toUpperCase(),
      },
      [subContentActions.UPDATE_EDUCATION]: {
        component: (
          <EducationForm
            key="updateEducationForm"
            isEdit
            updateIndex={this.state.educationFormUpdateIndex}
            profile={this.state.profile}
            handleProfileSave={this.handleProfileSave}
          />
        ),
        label: settingsPage.educationForm.updateBtnText.toUpperCase(),
      },
      [subContentActions.ADD_WORK]: {
        component: (
          <EmploymentForm
            key="addWorkForm"
            isEdit={false}
            updateIndex={this.state.employmentFormUpdateIndex}
            profile={this.state.profile}
            handleProfileSave={this.handleProfileSave}
          />
        ),
        label: settingsPage.workForm.addBtnText.toUpperCase(),
      },
      [subContentActions.UPDATE_WORK]: {
        component: (
          <EmploymentForm
            key="updateWorkForm"
            isEdit
            updateIndex={this.state.employmentFormUpdateIndex}
            profile={this.state.profile}
            handleProfileSave={this.handleProfileSave}
          />
        ),
        label: settingsPage.workForm.updateBtnText.toUpperCase(),
      },
      [subContentActions.ADD_ADDRESS]: {
        component: (
          <AddressForm
            key="addAddressForm"
            handleSave={async location => {
              this.state.profile.updateAddresses(location)
              await this.handleProfileSave()
            }}
          />
        ),
        label: addressForm.addBtnText.toUpperCase(),
      },
      [subContentActions.UPDATE_ADDRESS]: {
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
        label: addressForm.updateBtnText.toUpperCase(),
      },
    }
  }

  get navItems() {
    const { mapSubcontents, handleSelectParentItem } = this
    const {
      profile,
      moderation,
      store,
      security,
      skills,
      others,
    } = this.locale.settingsPage.navItems
    const navItems: NavItem[] = [
      {
        label: profile,
        handler: () => handleSelectParentItem(0),
        subItems: mapSubcontents(0),
      },
      {
        label: moderation,
        handler: () => handleSelectParentItem(1),
        subItems: mapSubcontents(1),
      },
      {
        label: store,
        handler: () => handleSelectParentItem(2),
        subItems: mapSubcontents(2),
      },
      {
        label: security,
        handler: () => handleSelectParentItem(3),
        subItems: mapSubcontents(3),
      },
      {
        label: skills,
        handler: () => handleSelectParentItem(4),
        subItems: mapSubcontents(4),
      },
      {
        label: others,
        handler: () => handleSelectParentItem(5),
        subItems: mapSubcontents(5),
      },
    ]
    return navItems
  }

  get currentCardContent() {
    const { currentAction, currentParentIndex, currentContentIndex } = this.state
    return currentAction === subContentActions.NONE
      ? this.mainContents[currentParentIndex][currentContentIndex]
      : this.subContents[currentAction]
  }

  public render() {
    const { settingsPage } = this.locale
    if (this.state.isLoading) {
      return (
        <div className="uk-flex uk-flex-row uk-flex-center">
          <div className="uk-margin-top">
            <CircleSpinner message={settingsPage.spinnerText} />
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
            title: settingsPage.header.toUpperCase(),
            navItems,
          }}
          mainContent={currentCardContent.component}
          handleBackBtn={handleBackBtn}
          showBackBtn={currentAction !== subContentActions.NONE}
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
      window.UIkit.notification(this.locale.settingsPage.authUpdateSuccessNotif, {
        status: 'success',
      })

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
      window.UIkit.notification(this.locale.settingsPage.credentialsUpdateSuccessNotif, {
        status: 'success',
      })
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
          this.setState({ currentContentIndex: index, currentAction: subContentActions.NONE })
        },
      }
    })
  }

  private handleSelectParentItem(index: number) {
    this.setState({
      currentParentIndex: index,
      currentContentIndex: 0,
      currentAction: subContentActions.NONE,
    })
  }

  private handleChangeAction(action: number) {
    this.setState({ currentAction: action })
  }

  private handleBackBtn() {
    this.setState({ currentAction: subContentActions.NONE })
  }

  private handleSelectAddress(addressIndex: number) {
    const { profile: registrationForm } = this.state
    this.setState({
      currentAction: subContentActions.UPDATE_ADDRESS,
      addressForm: registrationForm.extLocation.addresses[addressIndex],
      addressFormUpdateIndex: addressIndex,
    })
  }

  private handleSelectEducation(educationIndex: number) {
    this.setState({
      currentAction: subContentActions.UPDATE_EDUCATION,
      educationFormUpdateIndex: educationIndex,
    })
  }

  private handleSelectEmployment(educationIndex: number) {
    this.setState({
      currentAction: subContentActions.UPDATE_WORK,
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

    await this.handleProfileUpdate()
    localeInstance.setLanguage(this.state.profile.preferences.language)

    window.UIkit.notification(this.locale.settingsPage.profileUpdateSuccessNotif, {
      status: 'success',
    })
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
    await this.handleProfileUpdate()
    window.UIkit.notification(this.locale.settingsPage.profileSaveSuccessNotif, {
      status: 'success',
    })
    this.setState({
      currentAction: subContentActions.NONE,
    })
  }

  private handleModeratorRemove(moderator: Profile, index: number) {
    moderatorManagerInstance.removeModeratorFromSelection(moderator, index, true)
    this.setState({
      moderatorManager: moderatorManagerInstance,
    })
  }

  private handleModeratorSelect(moderator: Profile, moderatorSource: string, index: number) {
    moderatorManagerInstance.selectModerator(moderator, moderatorSource, index)
    this.setState({
      moderatorManager: moderatorManagerInstance,
    })
  }

  private async handleSubmitModeratorSelection() {
    const { settingsPage } = this.locale
    this.state.settings.storeModerators = this.state.moderatorManager.selectedModerators.map(
      moderator => moderator.peerID
    )
    const recentModerators = moderatorManagerInstance.recentModerators.filter(recentMod => {
      return !moderatorManagerInstance.selectedModerators.some(
        favoriteMod => favoriteMod.peerID === recentMod.peerID
      )
    })
    this.state.settings.recentModerators = recentModerators.map(moderator => moderator.peerID)

    moderatorManagerInstance.recentModerators = [...recentModerators]
    moderatorManagerInstance.favoriteModerators = [
      ...this.state.moderatorManager.selectedModerators,
    ]

    try {
      await this.state.settings.save()
      window.UIkit.notification(settingsPage.moderatorSaveSuccessNotif, { status: 'success' })
      this.setState({
        settings: this.state.settings,
        moderatorManager: this.state.moderatorManager,
      })
    } catch (e) {
      /**
       * Removing last 2 characters due to
       * weird server error response with extra '{}' at the end, as in:
       * {reason: '...'}{}
       */
      const errorResponse = JSON.parse(e.response.data.slice(0, -2))
      if (errorResponse.reason === 'listing expiration must be in the future') {
        window.UIkit.notification(settingsPage.moderatorSaveSuccessNotif, { status: 'success' })
        window.UIkit.notification(settingsPage.expiredListingNotif, { status: 'warning' })
      } else {
        window.UIkit.notification(e.message, { status: 'danger' })
      }
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
    window.clearTimeout(this.debounce)
    this.debounce = window.setTimeout(async () => {
      moderatorManagerInstance.find(searchStr)
      this.setState({
        moderatorManager: moderatorManagerInstance,
      })
    }, 500)
  }

  private async handleProfileUpdate() {
    await this.state.profile.update()
    this.props.profileContext.updateCurrentUser(this.state.profile)
  }
}

export default GeneralProfile
