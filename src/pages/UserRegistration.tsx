import axios from 'axios'
import React, { Component } from 'react'

import { IntroductionCard, RegistrationCard } from '../components/Card'
import SuccessCard from '../components/Card/SuccessCard'
import { RegistrationForm, TermsOfService } from '../components/Form'
import Countries from '../constants/Countries.json'

import config from '../config'
import CryptoCurrencies from '../constants/CryptoCurrencies.json'
import CurrencyTypes from '../constants/CurrencyTypes.json'
import FiatCurrencies from '../constants/FiatCurrencies.json'
import Languages from '../constants/Languages.json'
import UnitsOfMeasurement from '../constants/UnitsOfMeasurement.json'

import ProfileInterface from '../models/Profile'
import './UserRegistration.css'

interface State {
  currentIndex: number
  hasStarted: boolean
  numberOfPages: number
  registrationForm: ProfileInterface
  [key: string]: any
}

class UserRegistration extends Component<{}, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentIndex: 1,
      hasStarted: false,
      numberOfPages: 3,
      registrationForm: {
        handle: '',
        name: '',
        about: '',
        extLocation: {
          primary: 0,
          shipping: 0,
          billing: 0,
          return: 0,
          addresses: [
            {
              latitude: '',
              longitude: '',
              plusCode: '',
              addressOne: '',
              addressTwo: '',
              city: '',
              state: '',
              country: '',
              zipCode: '',
            },
          ],
        },
        preferences: {
          cryptocurrency: '',
          currencyDisplay: '',
          fiat: '',
          language: '',
          measurementUnit: '',
        },
      },
    }
    this.handleNext = this.handleNext.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
    this.getCurrentContent = this.getCurrentContent.bind(this)
    this.handleGetStarted = this.handleGetStarted.bind(this)
    this.renderCard = this.renderCard.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleAgree = this.handleAgree.bind(this)
  }

  public handleNext(event?: React.FormEvent) {
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
            data={this.state.registrationForm}
            availableCountries={Countries}
            fiatCurrencies={FiatCurrencies}
            currencyTypes={CurrencyTypes} // Fiat or Crypto
            cryptoCurrencies={CryptoCurrencies}
            languages={Languages}
            unitOfMeasurements={UnitsOfMeasurement} // Metric or English System
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
          />
        )
      }
      case 2: {
        return <TermsOfService />
      }
      case 3: {
        return (
          <SuccessCard
            name={this.state.registrationForm.name}
            onSuccessHome={this.handleSuccessHome}
          />
        )
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
      <div id="reg-container" className="uk-container-expand">
        {this.renderCard()}
      </div>
    )
  }

  private handleChange(field: string, value: any) {
    const { registrationForm } = this.state

    const path = field.split('.')
    let update = registrationForm

    for (let index = 0; index < path.length - 1; index++) {
      const element = path[index]
      update = update[element]
    }

    update[path[path.length - 1]] = value

    this.setState({
      registrationForm,
    })
  }

  private handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  private async handleAgree() {
    await axios.post(`${config.openBazaarHost}/ob/profile`, this.state.registrationForm)
    alert('Registration Successful')
    this.handleNext()
  }

  private handleSuccessHome() {
    window.location.href = '/'
  }
}

export default UserRegistration
