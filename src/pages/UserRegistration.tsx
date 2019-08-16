import React, { Component } from 'react'

import { IntroductionCard, RegistrationCard } from '../components/Card'
import SuccessCard from '../components/Card/SuccessCard'
import { RegistrationForm, TermsOfService } from '../components/Form'
import Countries from '../constants/Countries.json'
import CryptoCurrencies from '../constants/CryptoCurrencies'
import CurrencyTypes from '../constants/CurrencyTypes.json'
import FiatCurrencies from '../constants/FiatCurrencies.json'
import Languages from '../constants/Languages.json'
import UnitsOfMeasurement from '../constants/UnitsOfMeasurement.json'
import ImageUploaderInstance from '../utils/ImageUploaderInstance'
import NestedJSONUpdater from '../utils/NestedJSONUpdater'

import Profile from '../models/Profile'
import './UserRegistration.css'

const cryptoCurrencies = CryptoCurrencies()

interface State {
  avatar: string
  currentIndex: number
  hasStarted: boolean
  isSubmitting: boolean
  numberOfPages: number
  profile: Profile
  [key: string]: any
}

class UserRegistration extends Component<{}, State> {
  constructor(props: any) {
    super(props)
    const profile = new Profile()
    this.state = {
      avatar: '',
      currentIndex: 1,
      hasStarted: false,
      isSubmitting: false,
      numberOfPages: 3,
      profile,
    }
    this.getCurrentContent = this.getCurrentContent.bind(this)
    this.handleAgree = this.handleAgree.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleGetStarted = this.handleGetStarted.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderCard = this.renderCard.bind(this)
  }

  public async handleNext(event?: React.FormEvent) {
    if (event) {
      event.preventDefault()
    }
    const { numberOfPages } = this.state
    let { currentIndex } = this.state
    if (currentIndex < numberOfPages) {
      this.setState({ currentIndex: currentIndex += 1 })
    }
  }

  public handlePrev(event: React.FormEvent) {
    event.preventDefault()
    let { currentIndex } = this.state
    if (currentIndex > 1) {
      this.setState({ currentIndex: currentIndex -= 1 })
    }
  }

  public getCurrentContent() {
    const { currentIndex } = this.state
    switch (currentIndex) {
      case 1: {
        return (
          <RegistrationForm
            data={this.state.profile}
            availableCountries={Countries}
            fiatCurrencies={FiatCurrencies}
            currencyTypes={CurrencyTypes} // Fiat or Crypto
            cryptoCurrencies={cryptoCurrencies}
            languages={Languages}
            unitOfMeasurements={UnitsOfMeasurement} // Metric or English System
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            avatar={this.state.avatar}
            isSubmitting={this.state.isSubmitting}
          />
        )
      }
      case 2: {
        return <TermsOfService />
      }
      case 3: {
        return <SuccessCard name={this.state.profile.name} onSuccessHome={this.handleSuccessHome} />
      }
    }
  }

  public handleGetStarted() {
    this.setState({ hasStarted: true })
  }

  public renderCard() {
    const { hasStarted, numberOfPages, currentIndex } = this.state
    const { handleNext, handlePrev, getCurrentContent, handleGetStarted } = this
    return hasStarted ? (
      <RegistrationCard
        content={getCurrentContent()}
        currentIndex={currentIndex}
        numberOfPages={numberOfPages}
        handleNext={handleNext}
        handlePrev={handlePrev}
        onAgree={this.handleAgree}
      />
    ) : (
      <IntroductionCard handleGetStarted={handleGetStarted} />
    )
  }

  public render() {
    return (
      <div id="reg-container" className="uk-container-expand background-body">
        {this.renderCard()}
      </div>
    )
  }

  private async handleChange(field: string, value: any, parentField?: string) {
    if (field === 'avatar') {
      const base64ImageStr = await ImageUploaderInstance.convertToBase64(value[0])
      value = base64ImageStr
    }

    if (parentField) {
      const subFieldData = this.state[parentField]
      NestedJSONUpdater(subFieldData, field, value)
      this.setState({ subFieldData })
    } else {
      this.setState({
        [field]: value,
      })
    }
  }

  private async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    this.setState({
      isSubmitting: true,
    })

    if (this.state.avatar) {
      const avatarHashes = await ImageUploaderInstance.uploadImage(this.state.avatar)
      this.state.profile.avatarHashes = avatarHashes
    }

    this.setState({
      isSubmitting: false,
    })

    this.handleNext(event)
  }

  private async handleAgree() {
    const registrationForm = this.state.profile

    if (!registrationForm.name) {
      registrationForm.name = registrationForm.handle
    }

    await this.state.profile.save()
    window.UIkit.notification('Registration Successful', { status: 'success' })
    this.handleNext()
  }

  private handleSuccessHome() {
    window.location.href = '/'
  }
}

export default UserRegistration
