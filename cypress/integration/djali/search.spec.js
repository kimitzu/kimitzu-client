/// <reference types="Cypress" />
/* global context, cy, Cypress */

context('Search', () => {
  beforeEach(() => {
    cy.server({})
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/peer/*',
      response: 'fixture:profile/vendor.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/peer/get?id=moderator',
      response: 'fixture:profile/moderator.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/authenticate',
      response: { authenticated: false },
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8109/djali/search',
      response: 'fixture:listings/search_many.json',
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
      method: 'POST',
      url: ' http://localhost:4002/ob/images',
      response: 'fixture:images/listing.json',
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/ob/listing',
      response: { slug: 'The-Accountant' },
    }).as('newListing')
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/ob/publish',
      response: {},
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/exchangerate/btc',
      response: 'fixture:API/currency.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/moderators?async=true',
      response: {},
    })
  })

  it('Should see all entries in search', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('THIRD SERVER').should('exist')
    cy.contains('2.00 USD').should('exist')
  })

  it('Should properly convert to another currency', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/peer/*',
      response: 'fixture:profile/vendor_philippines.json',
    })
    cy.visit('http://localhost:3000/')
    cy.contains('THIRD SERVER').should('exist')
    cy.contains('104.08 PHP').should('exist')
  })

  it('Should open a listing', () => {
    cy.route({
      method: 'GET',
      url:
        'http://localhost:8109/djali/listing?hash=QmehvB3hJJGcA7FBjQfcYFwWbe8jdkf94GW3qoYDCdhCTt',
      response: 'fixture:listings/entry_fresh_ridges.json',
    })
    cy.route({
      method: 'GET',
      url:
        'http://localhost:4002/ob/ratings/QmYuz7HMF5SDMKjyUj3zCTqiq2rhAkWpDoxjhre8MLiHPN/fresh-ridges',
      response: 'fixture:ratings/empty.json',
    })
    cy.visit('http://localhost:3000/')
    cy.get(
      '#QmehvB3hJJGcA7FBjQfcYFwWbe8jdkf94GW3qoYDCdhCTt > a > :nth-child(1) > .img-list'
    ).click()
    cy.contains('Retrieving Listing...')
    cy.contains('Fresh Ridges').should('exist')
    cy.get('.priceSize').should('have.html', '0.27 USD/hour')
    cy.contains('noren.arevalo@gmail.com')
    cy.contains('Bitcoin (TBTC)')
    cy.contains('Rave')
  })
})
