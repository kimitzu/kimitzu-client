import React, { Component } from 'react'

import { IntroductionCard, RegistrationCard } from '../components/Card'
import { RegistrationForm, TermsOfService } from '../components/Form'
import './UserRegistration.css'

interface State {
  currentIndex: number
  hasStarted: boolean
  numberOfPages: number
}

class UserRegistration extends Component<{}, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentIndex: 1,
      hasStarted: false,
      numberOfPages: 2,
    }
    this.handleNext = this.handleNext.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
    this.getCurrentContent = this.getCurrentContent.bind(this)
    this.handleGetStarted = this.handleGetStarted.bind(this)
    this.renderCard = this.renderCard.bind(this)
  }

  public handleNext(event: React.FormEvent) {
    event.preventDefault()
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
    if (currentIndex === 1) {
      return <RegistrationForm availableCountries={[]} availableCurrencies={[]} />
    } else if (currentIndex === 2) {
      return <TermsOfService />
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
}

export default UserRegistration
