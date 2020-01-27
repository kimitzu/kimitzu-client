import React, { Component, ReactNode } from 'react'
import { Prompt, RouteComponentProps } from 'react-router'
import { ListingImportForm } from '../components/Form'
import Listing from '../models/Listing'
import Profile from '../models/Profile'
import Settings from '../models/Settings'

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
  jsons: string[]
}

class CreateListing extends Component<CreateListingProps, CreateListingState> {
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
      jsons: [],
    }
    this.handleFullSubmit = this.handleFullSubmit.bind(this)
  }

  public async handleFullSubmit(event: React.FormEvent) {
    const listing = this.state.listing
    const jsons = this.state.jsons

    for (let i = 0; i <= jsons.length - 1; i++) {
      listing.importJson(JSON.parse(jsons[i]))

      this.setState({
        isLoading: true,
      })

      try {
        await listing.save()
        window.UIkit.notification(this.locale.listingForm.notifications.addSuccess, {
          status: 'success',
        })
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
  }

  public render() {
    return (
      <div className="background-body full-vh uk-padding-small">
        <Prompt when={!this.state.isListingSaved} message={this.locale.listingForm.abandonPrompt} />
        <ListingImportForm
          jsons={this.state.jsons}
          onChange={listing => {
            this.setState({
              jsons: [...listing],
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
