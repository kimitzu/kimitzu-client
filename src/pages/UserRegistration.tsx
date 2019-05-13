import React, { Component, MouseEvent } from 'react'

import RegistrationCard from '../components/Card/RegistrationCard'
import { RegistrationForm, TermsOfService } from '../components/Form'

interface State {
  currentIndex: number
  numberOfPages: number
}

class UserRegistration extends Component<{}, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentIndex: 1,
      numberOfPages: 2,
    }
    this.handleNext = this.handleNext.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
    this.getCurrentContent = this.getCurrentContent.bind(this)
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

  public render() {
    const { numberOfPages, currentIndex } = this.state
    const { handleNext, handlePrev, getCurrentContent } = this
    return (
      <div className="uk-container-expand">
        <div className="uk-flex-center" data-uk-grid>
          <RegistrationCard
            content={getCurrentContent()}
            currentIndex={currentIndex}
            numberOfPages={numberOfPages}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        </div>
      </div>
    )
  }
}

export default UserRegistration
