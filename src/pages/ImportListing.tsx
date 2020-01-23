import Axios from 'axios'
import React, { Component, ReactNode } from 'react'
import { Prompt, RouteComponentProps } from 'react-router'
import { SideMenuWithContentCard } from '../components/Card'
import {
  AddressForm,
  ListingCouponsForm,
  ListingCryptoCurrenciesForm,
  ListingGeneralForm,
  ListingImportForm,
  ListingTermsAndConditionsForm,
  ModeratorSelectionForm,
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

import { Link } from 'react-router-dom'
import config from '../config'
import { localeInstance } from '../i18n'

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
  isLoading: boolean
  isListingNew: boolean
  isListingSaved: boolean
  [key: string]: any
  tempImages: string[]
}

class CreateListing extends Component<CreateListingProps, CreateListingState> {
  private debounce = 0
  private locale = localeInstance.get.localizations

  constructor(props: CreateListingProps) {
    super(props)
    const listing = new Listing()
    const profile = this.props.currentUser

    this.state = {
      currentUser: profile,
      isLoading: false,
      isListingNew: true,
      isListingSaved: false,
      listing,
      tempImages: [],
    }
    this.handleFullSubmit = this.handleFullSubmit.bind(this)
    this.handleSubmitForm = this.handleSubmitForm.bind(this)
  }

  // public async componentDidMount() { }

  public async handleFullSubmit(event: React.FormEvent) {
    event.preventDefault()
    const listing = this.state.listing
    console.log(listing, 'listinnnggggngngngn')
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(listing))
    const dlAnchorElem = document.getElementById('downloadAnchorElem')
    if (dlAnchorElem) {
      dlAnchorElem.setAttribute('href', dataStr)
      dlAnchorElem.setAttribute('download', 'scene.json')
      dlAnchorElem.click()
    }

    this.setState({
      isLoading: true,
    })

    const newImages = this.state.tempImages.filter(image => !image.startsWith('http'))

    if (this.state.tempImages.length <= 0) {
      const defaultLogo = await Axios.get(`${config.host}/icon.png`, { responseType: 'blob' })
      const defaultLogoBase64 = await ImageUploaderInstance.convertToBase64(defaultLogo.data)
      newImages.push(defaultLogoBase64)
    }

    if (listing.item.tags.length <= 0) {
      listing.item.tags.push('Kimitzu')
    }

    const imageUpload = newImages.map(base64Image => ImageUploaderInstance.uploadImage(base64Image))
    const updateOldImages = this.state.listing.item.images.filter(oldElements => {
      return this.state.tempImages.find(updatedElements => {
        const id = updatedElements.split('/')
        return oldElements.medium === id[id.length - 1]
      })
    })

    try {
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
      window.UIkit.notification(e.response.data.reason || e.message, {
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

  public handleSubmitForm(event?: React.FormEvent) {
    if (event) {
      event.preventDefault()
    }
    this.setState({
      currentFormIndex: this.state.currentFormIndex + 1,
    })
  }

  public render() {
    return (
      <div className="background-body full-vh uk-padding-small">
        <Prompt when={!this.state.isListingSaved} message={this.locale.listingForm.abandonPrompt} />
        <ListingImportForm
          handleContinue={this.handleSubmitForm}
          images={this.state.tempImages}
          onChange={images => {
            this.setState({
              tempImages: [...images],
            })
          }}
          isNew={this.state.isListingNew}
          handleFullSubmit={this.handleFullSubmit}
        />
      </div>
    )
  }
}

export default CreateListing
