import React, { Component, ReactNode } from 'react'

import { SideMenuWithContentCard } from '../components/Card'
import {
  AddressForm,
  ListingCouponsForm,
  ListingCryptoCurrenciesForm,
  ListingGeneralForm,
  ListingPhotosForm,
  ListingTermsAndConditionsForm,
  ShippingOptionForm,
  TagsForm,
} from '../components/Form'
import Listing from '../models/Listing'
import ImageUploaderInstance from '../utils/ImageUploaderInstance'
import NestedJSONUpdater from '../utils/NestedJSONUpdater'

interface CardContent {
  component: ReactNode
  title: string
}

interface CreateListingProps {
  props: any
}

interface CreateListingState {
  listing: Listing
  currentFormIndex: number
  tempImages: string[]
  isLoading: boolean
  [key: string]: any
}

class CreateListing extends Component<CreateListingProps, CreateListingState> {
  constructor(props: CreateListingProps) {
    super(props)
    const listing = new Listing()

    this.state = {
      currentFormIndex: 0,
      tempImages: [],
      isLoading: false,
      // === Formal Schema
      listing,
      // === TODO: Implement handlers
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
    }
    this.handleAddCoupons = this.handleAddCoupons.bind(this)
    this.handleAddShippingService = this.handleAddShippingService.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmitForm = this.handleSubmitForm.bind(this)
    this.handleFullSubmit = this.handleFullSubmit.bind(this)
    this.handleImageOpen = this.handleImageOpen.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
  }

  get contents() {
    const { handleInputChange, handleSubmitForm, handleAddShippingService, handleAddCoupons } = this
    return [
      {
        component: (
          <ListingGeneralForm
            data={this.state.listing}
            handleContinue={handleSubmitForm}
            handleInputChange={handleInputChange}
          />
        ),
        title: 'General',
      },
      {
        component: (
          <AddressForm
            onSaveAddress={handleSubmitForm}
            onAddressChange={this.handleAddressChange}
            onDeleteAddress={() => {
              console.log('Function Not Available')
            }}
            data={this.state.listing.location}
            isEdit={false}
            isListing
          />
        ),
        title: 'Location',
      },
      {
        component: (
          <ListingPhotosForm
            handleContinue={handleSubmitForm}
            images={this.state.tempImages}
            onImageOpen={this.handleImageOpen}
          />
        ),
        title: 'Photos',
      },
      {
        component: (
          <ShippingOptionForm
            data={this.state.shippingOptions}
            handleAddShippingService={handleAddShippingService}
            handleContinue={handleSubmitForm}
            handleInputChange={handleInputChange}
            disabled={this.state.listing.metadata.contractType === 'SERVICE'}
          />
        ),
        title: 'Shipping',
      },
      {
        component: (
          <TagsForm
            handleInputChange={handleInputChange}
            handleContinue={handleSubmitForm}
            tags={this.state.listing.item.tags}
          />
        ),
        title: 'Tags',
      },
      {
        component: (
          <ListingTermsAndConditionsForm
            handleInputChange={handleInputChange}
            handleContinue={handleSubmitForm}
            termsAndConditions={this.state.listing.termsAndConditions}
          />
        ),
        title: 'Terms and Conditions',
      },
      {
        component: (
          <ListingCouponsForm
            coupons={this.state.listing.coupons}
            handleAddCoupon={handleAddCoupons}
            handleContinue={handleSubmitForm}
            handleInputChange={handleInputChange}
          />
        ),
        title: 'Coupons',
      },
      {
        component: (
          <ListingCryptoCurrenciesForm
            handleContinue={this.handleFullSubmit}
            handleInputChange={handleInputChange}
            acceptedCurrencies={this.state.listing.metadata.acceptedCurrencies}
            isLoading={this.state.isLoading}
          />
        ),
        title: 'Accepted Currencies',
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

  public handleAddressChange(field: string, value: string | string[]) {
    this.handleInputChange(`location.${field}`, value, 'listing')
  }

  public async handleImageOpen(event: React.ChangeEvent<HTMLInputElement>) {
    const imageFiles = event.target.files
    let base64ImageFiles = []

    if (!imageFiles) {
      return
    }

    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < imageFiles.length; index++) {
      const imageElement = imageFiles[index]
      base64ImageFiles.push(ImageUploaderInstance.convertToBase64(imageElement))
    }

    base64ImageFiles = await Promise.all(base64ImageFiles)
    this.setState({
      tempImages: base64ImageFiles,
    })
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

  public handleSubmitForm(event: React.FormEvent) {
    event.preventDefault()
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

    const imageUpload = this.state.tempImages.map(base64Image =>
      ImageUploaderInstance.uploadImage(base64Image)
    )

    const images = await Promise.all(imageUpload)

    listing.item.images = images

    try {
      await listing.save()
      alert('Listing Successfully Posted')
      window.location.href = '/'
    } catch (e) {
      alert(e.message)
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
    return (
      <div className="background-body full-vh uk-padding-small">
        <SideMenuWithContentCard
          mainContentTitle={currentForm.title}
          menuContent={{
            title: 'CREATE LISTING',
            navItems,
          }}
          mainContent={currentForm.component}
          currentNavIndex={this.state.currentFormIndex}
        />
      </div>
    )
  }
}

export default CreateListing
