import React, { Component, ReactNode } from 'react'

import { SideMenuWithContentCard } from '../../components/Card'
import { AddressesCardGroup } from '../../components/CardGroup'
import { AddressForm, ModeratorForm, RegistrationForm } from '../../components/Form'

import { Button } from '../../components/Button'
import SocialMediaSettings from '../../components/Card/Settings/SocialMediaSettings'
import EducationCardGroup from '../../components/CardGroup/Settings/EducationCardGroup'
import EmploymentCardGroup from '../../components/CardGroup/Settings/EmploymentCardGroup'
import CustomDescriptionForm from '../../components/Form/CustomDescriptionForm'
import EducationForm from '../../components/Form/EducationForm'
import EmploymentForm from '../../components/Form/EmploymentForm'
import Countries from '../../constants/Countries.json'
import CryptoCurrencies from '../../constants/CryptoCurrencies'
import CurrencyTypes from '../../constants/CurrencyTypes.json'
import FiatCurrencies from '../../constants/FiatCurrencies.json'
import Languages from '../../constants/Languages.json'
import UnitsOfMeasurement from '../../constants/UnitsOfMeasurement.json'
import Profile from '../../models/Profile'
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
}

class GeneralProfile extends Component<ProfileSettings, GeneralProfileState> {
  constructor(props: ProfileSettings) {
    super(props)
    const profile = new Profile()
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
  }

  public async componentDidMount() {
    try {
      const profileData = await Profile.retrieve()
      this.setState({
        profile: profileData,
      })
    } catch (error) {
      if (error.response) {
        if (!error.response.data.success) {
          window.location.href = '/register'
        }
      }
    }
  }

  get mainContents() {
    const { avatar, isSubmitting, profile: registrationForm } = this.state
    const { handleChange, handleFormSubmit, handleSelectAddress, handleChangeAction } = this
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
              <Button
                className="uk-button uk-button-primary uk-align-center"
                onClick={handleFormSubmit}
                showSpinner={isSubmitting}
              >
                Save
              </Button>
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
          component: <div />,
          label: 'General',
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
      <div className="background-body full-vh uk-padding-small">
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
      </div>
    )
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
    alert('Profile updated')
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
    alert('Profile saved!')
    this.setState({
      currentAction: actions.NONE,
    })
  }
}

export default GeneralProfile
