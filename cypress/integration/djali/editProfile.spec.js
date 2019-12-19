/// <reference types="Cypress" />
/* global context, cy, Cypress */

context('Edit Profile', () => {
  beforeEach(() => {
    cy.server({})
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/*',
      response: 'fixture:profile/vendor.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/get?id=moderator',
      response: 'fixture:profile/moderator.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/authenticate',
      response: {
        authenticated: false,
      },
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8109/kimitzu/search',
      response: 'fixture:listings/search.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/chatconversations',
      response: [],
    })
    cy.route({
      method: 'GET',
      url: ' http://localhost:4002/ob/settings',
      response: 'fixture:settings/primary.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/exchangerate/btc',
      response: {},
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/moderators?async=true',
      response: {},
    })
    cy.route({
      method: 'POST',
      url: ' http://localhost:4002/ob/images',
      response: 'fixture:images/listing.json',
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/ob/listing',
      response: {
        slug: 'The-Accountant',
      },
    }).as('newListing')
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/ob/publish',
      response: {},
    })
    cy.route({
      method: 'PUT',
      url: 'http://localhost:4002/ob/profile',
      response: {},
    }).as('updateProfile')

    cy.visit('http://localhost:3000/')
  })

  it('should update General Profile Settings', () => {
    cy.get('#account').click()
    cy.get('#account').click()
    cy.get('#settings').click({force: true})

    cy.wait(500)

    cy.get('#username')
      .clear()
      .type('New Handle')

    cy.get('#fullname')
      .clear()
      .type('New FullName')

    cy.get('.mde-text')
      .clear()
      .type('New Description')

    cy.get('#email')
      .clear()
      .type('New Email')

    cy.get('#countries').select('United States')

    cy.get(':nth-child(7) > #form-select > .uk-select').select('Philippine Peso (₱)')

    cy.get(':nth-child(8) > #form-select > .uk-select').select('Litecoin (TLTC)')

    cy.get(':nth-child(9) > #form-select > .uk-select').select('Cryptocurrency')

    cy.get(':nth-child(10) > #form-select > .uk-select').select('English')

    cy.get('#preferred-units').select('English System  (Mile, Foot, Inch, Pound)')

    cy.get('#kimitzu-btn').click()

    cy.get('.uk-notification-message > div').should('exist')

    cy.wait('@updateProfile').then(function(xhr) {
      const request = xhr.requestBody

      expect(request.handle).to.equal('New Handle')
      expect(request.name).to.equal('New FullName')
      expect(request.shortDescription).to.equal('New Description...')
      expect(request.location).to.equal('US, ')

      expect(request.preferences.fiat).to.equal('PHP')
      expect(request.preferences.cryptocurrency).to.equal('TLTC')
      expect(request.preferences.currencyDisplay).to.equal('CRYPTO')
      expect(request.preferences.language).to.equal('en')
      expect(request.preferences.measurementUnit).to.equal('ENGLISH')
    })
  })

  it('should update Social Medial Profile Settings', () => {
    cy.get('#account').click()
    cy.get('#account').click()
    cy.get('#settings').click({force: true})

    cy.wait(500)

    cy.get('#desktop-social-media > a').click()

    cy.get(
      ':nth-child(1) > :nth-child(2) > .uk-grid > .uk-flex > :nth-child(1) > .uk-select'
    ).select('500px')
    cy.get(
      ':nth-child(1) > :nth-child(2) > .uk-grid > .uk-flex > :nth-child(2) > .uk-input'
    )
      .clear()
      .type('500pxUsername')
    cy.get(':nth-child(1) > :nth-child(2) > .uk-grid > .uk-flex > :nth-child(3) > .uk-input')
      .clear()
      .type('500pxProof')

    cy.get(
      ':nth-child(2) > :nth-child(2) > .uk-grid > .uk-flex > :nth-child(1) > .uk-select'
    ).select('Youtube')
    cy.get(
      ':nth-child(2) > :nth-child(2) > .uk-grid > .uk-flex > :nth-child(2) > .uk-input'
    ).type('YoutubeUsername')
    cy.get(
      ':nth-child(2) > :nth-child(2) > .uk-grid > .uk-flex > :nth-child(3) > .uk-input'
    ).type('YoutubeProof')

    cy.get('#kimitzu-btn').click()

    cy.get('.uk-notification-message > div').should('exist')

    cy.wait('@updateProfile').then(function(xhr) {
      const request = xhr.requestBody

      expect(JSON.stringify(request.contactInfo.social[0])).to.equal(
        JSON.stringify({
          proof: '500pxProof',
          type: '500px',
          username: '500pxUsername',
        })
      )

      expect(JSON.stringify(request.contactInfo.social[1])).to.equal(
        JSON.stringify({
          type: 'youtube',
          username: 'YoutubeUsername',
          proof: 'YoutubeProof',
        })
      )
    })
  })

  it('should update Education Profile Settings', () => {
    cy.get('#account').click()
    cy.get('#account').click()
    cy.get('#settings').click({force: true})

    cy.wait(500)

    cy.get('#desktop-education > a').click()
    cy.get('#add-address-text').click()

    cy.get('.uk-fieldset > :nth-child(1) > .uk-input').type('New School Name 1')

    cy.get('.uk-fieldset > :nth-child(2) > .uk-input').type('New Degree 1')

    cy.get('.uk-textarea').type('New Description 1')

    cy.get('#input1 > .uk-input').type('2015-01-01')
    cy.get('#input2 > .uk-input').type('2018-01-01')

    cy.get('.uk-margin-right > .uk-input').type('New City 1')

    cy.get('.uk-select').select('Zimbabwe')

    cy.get('#kimitzu-btn').click()

    cy.get('.uk-notification-message > div').should('exist')

    cy.wait('@updateProfile').then(function(xhr) {
      const educationHistory = xhr.requestBody.background.educationHistory

      const expectedEducationHistory = {
        institution: 'New School Name 1',
        degree: 'New Degree 1',
        description: 'New Description 1',
        location: { city: 'New City 1', country: 'ZW' },
        period: { from: '2015-01-01T00:00:00.000Z', to: '2018-01-01T00:00:00.000Z' },
        country: { city: 'New City 1', country: 'ZW' },
      }

      expect(JSON.stringify(educationHistory[0])).to.equal(JSON.stringify(expectedEducationHistory))
    })
  })

  it('should update Work History Profile Settings', () => {
    cy.get('#account').click()
    cy.get('#account').click()
    cy.get('#settings').click({force: true})

    cy.wait(500)

    cy.get('#desktop-work-history > a').click()
    cy.get('#add-address-text').click()

    cy.get('.uk-fieldset > :nth-child(1) > .uk-input').type('New Company 1')

    cy.get('.uk-fieldset > :nth-child(2) > .uk-input').type('New Company Position')

    cy.get('.uk-textarea').type('New Description 1')

    cy.get('.uk-checkbox').check()

    cy.get('#input1 > .uk-input').type('2015-01-01')

    cy.get('.uk-margin-right > .uk-input').type('New City 1')

    cy.get('.uk-select').select('Afghanistan')

    cy.get('#kimitzu-btn').click()

    cy.wait('@updateProfile').then(function(xhr) {
      const employmentHistory = xhr.requestBody.background.employmentHistory

      const expectedEmploymentHistory = {
        company: 'New Company 1',
        role: 'New Company Position',
        description: 'New Description 1',
        location: { city: 'New City 1', country: 'AF' },
        period: { from: '2015-01-01T00:00:00.000Z' },
        country: { city: 'New City 1', country: 'AF' },
      }

      expect(JSON.stringify(employmentHistory[0])).to.equal(
        JSON.stringify(expectedEmploymentHistory)
      )
    })
  })

  it('should update Address Profile Setting', () => {
    cy.get('#account').click()
    cy.get('#account').click()
    cy.get('#settings').click({force: true})

    cy.wait(500)

    cy.get('#desktop-addresses > a').click()
    cy.get('#address-text').click()

    cy.get('#street-address-1').type('New Address 1')
    cy.get('#street-address-2').type('New Address 2')

    cy.get('#plus-code').type('New Plus Code')

    cy.get('#latitude').type('1.0')
    cy.get('#longitude').type('1.0')

    cy.get('#city').type('New City')
    cy.get('#state').type('New State')

    cy.get('#zipCode').type('9999')

    cy.get('#countries').select('Afghanistan')

    cy.get('#save-btn-div > .uk-button-primary').click()

    cy.get('.uk-notification-message > div').should('exist')

    cy.wait('@updateProfile').then(function(xhr) {
      const addresses = xhr.requestBody.extLocation.addresses

      const expectedAddress = {
        addressOne: 'New Address 1',
        addressTwo: 'New Address 2',
        city: 'New City',
        country: 'AF',
        latitude: '1.0',
        longitude: '1.0',
        plusCode: 'New Plus Code',
        state: 'New State',
        zipCode: '9999',
        type: ['primary', 'shipping', 'billing', 'return'],
      }

      expect(JSON.stringify(addresses[0])).to.equal(JSON.stringify(expectedAddress))
    })
  })
})
