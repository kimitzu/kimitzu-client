/// <reference types="Cypress" />
/* global context, cy, Cypress */

context('Browse Listing', () => {
  beforeEach(() => {
    cy.server({})

    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/exchangerate/btc',
      response: {}
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/moderators?async=true',
      response: {}
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/peer/*',
      response: 'fixture:profile/vendor.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/authenticate',
      response: {
        authenticated: false
      },
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8109/djali/search',
      response: 'fixture:listings/search.json',
    }).as('search')
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/chatconversations',
      response: [],
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/ratings/QmYuz7HMF5SDMKjyUj3zCTqiq2rhAkWpDoxjhre8MLiHPN/violin',
      response: {}
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/ratings/QmYuz7HMF5SDMKjyUj3zCTqiq2rhAkWpDoxjhre8MLiHPN/microsoft-office-suite-installation',
      response: {}
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/listing?hash=QmPxqKM4iBJMV3HgJpAZCc4MNv59Wx6pUVSjPc3HN7sZFn',
      response: 'fixture:listings/microsoft_office_installation.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/listing?hash=QmewzcB7xj43mModCeUMUBC5Rx8uTKQQ2JzSDeVAghN1XK',
      response: 'fixture:listings/violin.json'
    })

    cy.visit('http://localhost:3000/')
  })

  it('should display detailed information of 2 Listings', () => {

    cy.get('#QmPxqKM4iBJMV3HgJpAZCc4MNv59Wx6pUVSjPc3HN7sZFn').click()
    cy.contains('Microsoft Office Suite Installation')
    cy.contains('Service')
    cy.contains('2521-0: Database Designers and Administrators')
    cy.contains('20 USD')
    cy.contains('Quality-focused Personal Loan Account bypass circuit web-enabled Lead Rustic Concrete Shirt leading edge Diverse feed regional Gloves Small Industrial sky blue Towels')
    cy.contains('Refined Cotton Computer partnerships Soap Intranet synthesize Books Garden International utilisation Cambodia monitor Security client-driven Persevering Handcrafted alarm approach capacitor scalable Games background Computer Director Cuban Peso Peso Convertible')

    cy.get(':nth-child(1) > .uk-text-capitalize').click()

    cy.get('#QmewzcB7xj43mModCeUMUBC5Rx8uTKQQ2JzSDeVAghN1XK').click()
    cy.contains('Violin')
    cy.contains('Service')
    cy.contains('251-0: Software and Applications Developers and Analysts')
    cy.contains('15 USD')
    cy.contains('AI Generic 4th generation Pound Sterling Chair application incremental back up Bedfordshire Singapore Sausages Corporate Concrete withdrawal synthesize Small')
    cy.contains('New Mexico Facilitator productize secondary Glen North Carolina focus group Avon San Marino customer loyalty copying Minnesota Intelligent Plastic Towels Frozen Handmade Plastic Ball Mouse navigating Faroe Islands invoice Well 1080p red infomediaries overriding')
  })

  it('should verify sorting request of listings', () => {
    // to ignore the first two calls of @search route
    cy.wait('@search')
    cy.wait('@search')

    cy.get('.uk-expand > .uk-select').select("Alphabetically (Z → A)")
    cy.wait('@search').then((xhr) => {
      const sortingRequest = xhr.request.body.sort
      expect(sortingRequest).to.equal('x.item.title >= y.item.title')
    })

    cy.get('.uk-expand > .uk-select').select("Alphabetically (A → Z)")
    cy.wait('@search').then((xhr) => {
      const sortingRequest = xhr.requestBody.sort
      expect(sortingRequest).to.equal('x.item.title <= y.item.title')
    })

    cy.get('.uk-expand > .uk-select').select("Price (Low → High)")
    cy.wait('@search').then(function(xhr) {
      const sortingRequest = xhr.requestBody.sort
      expect(sortingRequest).to.equal('x.item.price <= y.item.price')
    })

    cy.get('.uk-expand > .uk-select').select("Price (High → Low)")
    cy.wait('@search').then(function(xhr) {
      const sortingRequest = xhr.requestBody.sort
      expect(sortingRequest).to.equal('x.item.price >= y.item.price')
    })

    cy.get('.uk-expand > .uk-select').select("Rating (Low → High)")
    cy.wait('@search').then(function(xhr) {
      const sortingRequest = xhr.requestBody.sort
      expect(sortingRequest).to.equal('x.averageRating <= y.averageRating')
    })

    cy.get('.uk-expand > .uk-select').select("Rating (High → Low)")
    cy.wait('@search').then(function(xhr) {
      const sortingRequest = xhr.requestBody.sort
      expect(sortingRequest).to.equal('x.averageRating >= y.averageRating')
    })
  })

})