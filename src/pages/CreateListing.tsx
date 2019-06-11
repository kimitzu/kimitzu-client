import React, { Component, ReactNode } from 'react'

import { SideMenuWithContentCard } from '../components/Card'
import {
  ListingCouponsForm,
  ListingCryptoCurrenciesForm,
  ListingGeneralForm,
  ListingPhotosForm,
  ListingTermsAndConditionsForm,
  ShippingOptionForm,
  TagsForm,
} from '../components/Form'

interface CardContent {
  component: ReactNode
  title: string
}

interface CreateListingProps {
  props: any
}

interface CreateListingState {
  [x: string]: any
}

class CreateListing extends Component<CreateListingProps, CreateListingState> {
  constructor(props: CreateListingProps) {
    super(props)
    this.state = {
      currentFormIndex: 0,
      generalForm: {
        title: '',
        type: '',
        price: 0,
        condition: '',
        sku: '',
        nsfw: false,
        description: '',
      },
      images: [],
      shippingOptionForm: {
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
      tags: [],
      termsAndConditions: '',
      coupons: [
        {
          title: '',
          code: '',
          discountType: '',
          discount: 0,
        },
      ],
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleSubmitForm = this.handleSubmitForm.bind(this)
    this.handleAddShippingService = this.handleAddShippingService.bind(this)
    this.handleAddCoupons = this.handleAddCoupons.bind(this)
  }

  get contents() {
    const {
      generalForm,
      images,
      shippingOptionForm,
      tags,
      termsAndConditions,
      coupons,
    } = this.state
    const {
      handleInputChange,
      handleSelectChange,
      handleSubmitForm,
      handleAddShippingService,
      handleAddCoupons,
    } = this
    return [
      {
        component: (
          <ListingGeneralForm
            data={generalForm}
            handleContinue={handleSubmitForm}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
        ),
        title: 'General',
      },
      {
        component: <ListingPhotosForm handleContinue={handleSubmitForm} images={images} />,
        title: 'Photos',
      },
      {
        component: (
          <ShippingOptionForm
            data={shippingOptionForm}
            handleAddShippingService={handleAddShippingService}
            handleContinue={handleSubmitForm}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
        ),
        title: 'Shipping',
      },
      {
        component: (
          <TagsForm
            handleInputChange={handleInputChange}
            handleContinue={handleSubmitForm}
            tags={tags}
          />
        ),
        title: 'Tags',
      },
      {
        component: (
          <ListingTermsAndConditionsForm
            handleInputChange={handleInputChange}
            handleContinue={handleSubmitForm}
            termsAndConditions={termsAndConditions}
          />
        ),
        title: 'Terms and Conditions',
      },
      {
        component: (
          <ListingCouponsForm
            coupons={coupons}
            handleAddCoupon={handleAddCoupons}
            handleContinue={handleSubmitForm}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
        ),
        title: 'Coupons',
      },
      {
        component: <ListingCryptoCurrenciesForm handleSubmit={handleSubmitForm} />,
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

  public handleInputChange() {
    // TODO
  }

  public handleSelectChange() {
    // TODO
  }

  public handleSubmitForm() {
    // TODO
  }

  // TODO:
  public handleAddShippingService() {
    const shippingOptionForm = { ...this.state.shippingOptionForm }
    shippingOptionForm.shippingServices.push({
      name: '',
      deliveryTime: '',
      price: 0,
      priceAddtl: 0,
    })
    this.setState({ shippingOptionForm })
  }

  public handleAddCoupons() {
    this.setState(prevState => ({
      coupons: [...prevState.coupons, { title: '', code: '', discountType: '', discount: 0 }],
    }))
  }

  public render() {
    const { contents, navItems, currentForm } = this
    return (
      <div className="background-body full-vh uk-padding-small">
        <SideMenuWithContentCard
          mainContentTitle={currentForm.title}
          menuContent={{
            title: 'CREATE LISTING',
            navItems,
          }}
          mainContent={currentForm.component}
        />
      </div>
    )
  }
}

export default CreateListing
