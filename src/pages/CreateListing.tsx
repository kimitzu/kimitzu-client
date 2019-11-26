import React, { Component, ReactNode } from 'react'
import { Prompt, RouteComponentProps } from 'react-router'
import { SideMenuWithContentCard } from '../components/Card'
import {
  AddressForm,
  ListingCouponsForm,
  ListingCryptoCurrenciesForm,
  ListingGeneralForm,
  ListingPhotosForm,
  ListingTermsAndConditionsForm,
  ModeratorSelectionForm,
  ShippingOptionForm,
  TagsForm,
} from '../components/Form'
import { ModeratorInfoModal } from '../components/Modal'
import CryptoCurrencies from '../constants/CryptoCurrencies'
import Listing from '../models/Listing'
import { ModeratorManager, moderatorManagerInstance } from '../models/ModeratorManager'
import Profile from '../models/Profile'
import Settings from '../models/Settings'
import ImageUploaderInstance from '../utils/ImageUploaderInstance'
import NestedJSONUpdater from '../utils/NestedJSONUpdater'

import { localeInstance } from '../i18n'

const cryptoCurrenciesConstants = [...CryptoCurrencies()]
cryptoCurrenciesConstants.splice(0, 1)
const cryptoCurrencies = cryptoCurrenciesConstants.map(crypto => crypto.value)

interface CardContent {
  component: ReactNode
  title: string
}

interface RouteParams {
  id: string
}

interface CreateListingProps extends RouteComponentProps<RouteParams> {
  currentUser: Profile
  settings: Settings
}

interface CreateListingState {
  listing: Listing
  currentUser: Profile
  currentFormIndex: number
  tempImages: string[]
  isLoading: boolean
  selectedModerator: Profile
  moderatorManager: ModeratorManager
  settings: Settings
  hasFetchedAModerator: boolean
  isListingNew: boolean
  isListingSaved: boolean
  [key: string]: any
}

class CreateListing extends Component<CreateListingProps, CreateListingState> {
  private debounce = 0
  private locale = localeInstance.get.localizations

  constructor(props: CreateListingProps) {
    super(props)
    const listing = new Listing()
    const profile = this.props.currentUser

    this.state = {
      settings: new Settings(),
      currentUser: profile,
      currentFormIndex: 0,
      tempImages: [],
      isLoading: false,
      hasFetchedAModerator: true,
      isListingNew: true,
      isListingSaved: false,
      // === Formal Schema
      listing,
      selectedModerator: new Profile(),
      originalModerators: [],
      // === TODO: Implement handlers if shipping will be supported in the future
      shippingOptions: {
        destination: '',
        optionTitle: '',
        type: '',
        shippingServices: [
          {
            name: '',
            deliveryTime: '',
            price: 0,
            priceAddtl: 0,
          },
        ],
      },
      // === Moderators
      moderatorManager: moderatorManagerInstance,
    }
    this.handleAddCoupons = this.handleAddCoupons.bind(this)
    this.handleAddShippingService = this.handleAddShippingService.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmitForm = this.handleSubmitForm.bind(this)
    this.handleFullSubmit = this.handleFullSubmit.bind(this)
    this.handleRemoveRow = this.handleRemoveRow.bind(this)
    this.handleSubmitModeratorSelection = this.handleSubmitModeratorSelection.bind(this)
    this.handleShowModeratorModal = this.handleShowModeratorModal.bind(this)
    this.handleModeratorSearch = this.handleModeratorSearch.bind(this)
    this.handleModeratorSelect = this.handleModeratorSelect.bind(this)
    this.handleModeratorRemove = this.handleModeratorRemove.bind(this)
  }

  public async componentDidMount() {
    this.locale = localeInstance.get.localizations
    const id = this.props.match.params.id
    const settings = this.props.settings

    if (id) {
      const { listing, imageData } = await Listing.retrieve(id)

      if (!listing.isOwner) {
        window.UIkit.notification(this.locale.listingForm.notifications.cannotEdit, {
          status: 'warning',
        })
        window.location.hash = '/'
        return
      }
      await moderatorManagerInstance.setSelectedModerators(listing.moderators)

      const images = imageData.map(img => img.src)
      this.setState({
        listing,
        tempImages: images,
        isListingNew: false,
      })
    } else {
      const listing = { ...this.state.listing }
      listing.metadata.acceptedCurrencies = [...cryptoCurrencies]
      moderatorManagerInstance.selectedModerators = []
    }

    const profile = this.props.currentUser

    this.setState({
      moderatorManager: moderatorManagerInstance,
      currentUser: profile,
      settings,
      hasFetchedAModerator: true,
    })
  }

  get contents() {
    const { hasFetchedAModerator } = this.state
    const {
      handleInputChange,
      handleSubmitForm,
      handleRemoveRow,
      handleAddShippingService,
      handleShowModeratorModal,
      handleSubmitModeratorSelection,
      handleAddCoupons,
    } = this
    return [
      {
        component: (
          <ListingGeneralForm
            key={this.state.listing.metadata.serviceClassification}
            data={this.state.listing}
            handleContinue={handleSubmitForm}
            isNew={this.state.isListingNew}
            handleFullSubmit={this.handleFullSubmit}
          />
        ),
        title: this.locale.generalLabel,
      },
      {
        component: (
          <AddressForm
            data={this.state.listing.location}
            isListing
            handleSave={location => {
              this.state.listing.location = location
              handleSubmitForm()
            }}
            isNew={this.state.isListingNew}
            handleFullSubmit={this.handleFullSubmit}
          />
        ),
        title: this.locale.locationLabel,
      },
      {
        component: (
          <ListingPhotosForm
            handleContinue={handleSubmitForm}
            images={this.state.tempImages}
            onChange={images => {
              this.setState({
                tempImages: [...images],
              })
            }}
            isNew={this.state.isListingNew}
            handleFullSubmit={this.handleFullSubmit}
          />
        ),
        title: this.locale.listingForm.navItems.photosLabel,
      },
      // {
      //   component: (
      //     <ShippingOptionForm
      //       data={this.state.shippingOptions}
      //       handleAddShippingService={handleAddShippingService}
      //       handleContinue={handleSubmitForm}
      //       handleInputChange={handleInputChange}
      //       disabled={this.state.listing.metadata.contractType === 'SERVICE'}
      //     />
      //   ),
      //   title: 'Shipping',
      // },
      {
        component: (
          <div className="uk-flex uk-flex-column uk-width-1-1">
            <div className="uk-alert-primary uk-padding-small uk-margin-bottom">
              {this.locale.listingForm.tagsHelper}
            </div>
            <TagsForm
              onSubmit={tags => {
                const listing = this.state.listing
                listing.item.tags = tags
                this.setState({
                  listing,
                })
                this.handleSubmitForm()
              }}
              tags={this.state.listing.item.tags}
              isNew={this.state.isListingNew}
              handleFullSubmit={this.handleFullSubmit}
            />
          </div>
        ),
        title: this.locale.listingForm.tagsLabel,
      },
      {
        component: (
          <div className="uk-flex uk-flex-column uk-width-1-1">
            {this.state.settings.storeModerators.length <= 0 ? (
              <div className="uk-alert-warning uk-padding-small uk-margin-bottom" uk-alert>
                {this.locale.listingForm.moderatorsHelper1}
                <br />
                {this.locale.listingForm.moderatorsHelper2}
                <a
                  href="#"
                  onClick={event => {
                    event.preventDefault()
                    window.location.hash = '/settings'
                  }}
                >
                  {this.locale.listingForm.moderatorsHelperLink}
                </a>
                .
              </div>
            ) : null}
            <ModeratorSelectionForm
              moderatorManager={this.state.moderatorManager}
              handleSelectModerator={this.handleModeratorSelect}
              handleRemoveModerator={this.handleModeratorRemove}
              handleSubmit={handleSubmitModeratorSelection}
              handleModeratorSearch={this.handleModeratorSearch}
              handleMoreInfo={handleShowModeratorModal}
              showSpinner={!hasFetchedAModerator}
              isNew={this.state.isListingNew}
              handleFullSubmit={this.handleFullSubmit}
              isListing
            />
          </div>
        ),
        title: this.locale.listingForm.navItems.moderatorsLabel,
      },
      {
        component: (
          <ListingTermsAndConditionsForm
            handleInputChange={handleInputChange}
            handleContinue={handleSubmitForm}
            termsAndConditions={this.state.listing.termsAndConditions}
            isNew={this.state.isListingNew}
            handleFullSubmit={this.handleFullSubmit}
          />
        ),
        title: this.locale.listingForm.termsAndConditionsLabel,
      },
      {
        component: (
          <ListingCouponsForm
            coupons={this.state.listing.coupons}
            handleAddCoupon={handleAddCoupons}
            handleContinue={handleSubmitForm}
            handleInputChange={handleInputChange}
            handleRemoveRow={handleRemoveRow}
            isNew={this.state.isListingNew}
            handleFullSubmit={this.handleFullSubmit}
          />
        ),
        title: this.locale.listingForm.navItems.couponsLabel,
      },
      {
        component: (
          <ListingCryptoCurrenciesForm
            handleContinue={this.handleFullSubmit}
            handleInputChange={handleInputChange}
            acceptedCurrencies={this.state.listing.metadata.acceptedCurrencies}
            isLoading={this.state.isLoading}
            isNew={this.state.isListingNew}
          />
        ),
        title: this.locale.listingForm.navItems.currenciesLabel,
      },
    ]
  }

  get navItems() {
    return this.contents.map((content: CardContent, index: number) => {
      return {
        label: content.title,
        handler: () => {
          this.setState({ currentFormIndex: index })
        },
      }
    })
  }

  get currentForm() {
    const { currentFormIndex } = this.state
    return this.contents[currentFormIndex]
  }

  public handleInputChange(field: string, value: any, parentField?: string) {
    if (parentField) {
      const subFieldData = this.state[parentField]
      NestedJSONUpdater(subFieldData, field, value)
      this.setState({ ...this.state })
    } else {
      this.setState({
        [field]: value,
      })
    }
  }

  public handleSubmitForm(event?: React.FormEvent) {
    if (event) {
      event.preventDefault()
    }
    this.setState({
      currentFormIndex: this.state.currentFormIndex + 1,
    })
  }

  // TODO: Handle properly
  public handleAddShippingService() {
    const tempShippingService = {
      name: '',
      deliveryTime: '',
      price: 0,
      priceAddtl: 0,
    }
    const shippingOptions = this.state.shippingOptions
    shippingOptions.shippingServices = [...shippingOptions.shippingServices, tempShippingService]
    this.setState({ shippingOptions })
  }

  public handleAddCoupons() {
    this.state.listing.addCoupon()
    this.setState({
      listing: this.state.listing,
    })
  }

  public async handleFullSubmit(event: React.FormEvent) {
    event.preventDefault()
    const listing = this.state.listing

    this.setState({
      isLoading: true,
    })

    const newImages = this.state.tempImages.filter(image => !image.startsWith('http'))
    const imageUpload = newImages.map(base64Image => ImageUploaderInstance.uploadImage(base64Image))
    const updateOldImages = this.state.listing.item.images.filter(oldElements => {
      return this.state.tempImages.find(updatedElements => {
        const id = updatedElements.split('/')
        return oldElements.medium === id[id.length - 1]
      })
    })

    try {
      const images = await Promise.all(imageUpload)
      listing.item.images = [...updateOldImages, ...images]
      if (this.state.isListingNew) {
        await listing.save()
        window.UIkit.notification(this.locale.listingForm.notifications.addSuccess, {
          status: 'success',
        })
      } else {
        await listing.update()
        window.UIkit.notification(this.locale.listingForm.notifications.updateSuccess, {
          status: 'success',
        })
      }
      this.setState({
        isListingSaved: true,
      })
      await this.state.currentUser.crawlOwnListings()
      setTimeout(() => {
        window.location.hash = '/'
      }, 2000)
    } catch (e) {
      window.UIkit.notification(e.message, {
        status: 'danger',
      })
      this.setState({
        isLoading: false,
      })
    }

    this.setState({
      isLoading: false,
    })
  }

  public render() {
    const { navItems, currentForm } = this
    const { selectedModerator } = this.state
    return (
      <div className="background-body full-vh uk-padding-small">
        <Prompt when={!this.state.isListingSaved} message={this.locale.listingForm.abandonPrompt} />
        <SideMenuWithContentCard
          mainContentTitle={currentForm.title}
          menuContent={{
            title: this.state.isListingNew
              ? this.locale.listingForm.addBtnText.toUpperCase()
              : this.locale.listingForm.updateBtnText.toUpperCase(),
            navItems,
          }}
          mainContent={currentForm.component}
          currentNavIndex={this.state.currentFormIndex}
        />
        <ModeratorInfoModal profile={selectedModerator} />
      </div>
    )
  }

  private handleRemoveRow(type: string, index: number) {
    const { listing } = this.state
    if (type === 'coupon') {
      listing.removeCoupon(index)
    }
    this.setState({ listing })
  }

  private handleModeratorRemove(moderator: Profile, index: number) {
    moderatorManagerInstance.removeModeratorFromSelection(moderator, index)
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

  private handleSubmitModeratorSelection() {
    const { listing, moderatorManager, currentFormIndex } = this.state
    listing.moderators = moderatorManager.selectedModerators.map(moderator => moderator.peerID)
    this.setState({
      listing,
      currentFormIndex: currentFormIndex + 1,
    })
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
}

export default CreateListing
