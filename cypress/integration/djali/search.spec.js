/// <reference types="Cypress" />
/* global context, cy, Cypress */

import initialize from "../../support/utils/Initialize"

context('Search', () => {
  beforeEach(() => {
    cy.server({})

    initialize(cy)

    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/get?id=moderator',
      response: 'fixture:profile/moderator.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/*',
      response: 'fixture:profile/vendor.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/authenticate',
      response: { authenticated: false },
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8109/kimitzu/search',
      response: 'fixture:listings/search_many.json',
    }).as('search')
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/chatconversations',
      response: [],
    })
    cy.route({
      method: 'GET',
      url: ' http://localhost:8100/ob/settings',
      response: 'fixture:settings/primary.json',
    })
    cy.route({
      method: 'POST',
      url: ' http://localhost:8100/ob/images',
      response: 'fixture:images/listing.json',
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8100/ob/listing',
      response: { slug: 'The-Accountant' },
    }).as('newListing')
    cy.route({
      method: 'POST',
      url: 'http://localhost:8100/ob/publish',
      response: {},
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/exchangerate/btc',
      response: 'fixture:API/currency.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/moderators?async=true',
      response: {},
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/listing?hash=*',
      response: 'fixture:listings/creative_marketing_full_response.json',
    })
  })

  it('Should see all entries in search', () => {
    cy.visit('http://localhost:3000/')
    cy.wait('@search')
    cy.contains('Creative Marketing').should('exist')
    cy.contains('0.38').should('exist')
    cy.contains('USD').should('exist')
  })

  it('Should properly convert to another currency', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/get?id=&force=true',
      response: 'fixture:profile/vendor_philippines.json',
    })
    cy.visit('http://localhost:3000/')
    cy.contains('Creative Marketing').should('exist')
    cy.contains('19.77').should('exist')
    cy.contains('PHP').should('exist')
  })

  it('Should open a listing', () => {
    cy.route({
      method: 'GET',
      url:
        'http://localhost:8109/kimitzu/listing?hash=Qmb1FjaFuXsVmvkhwQPEnuoNLR7izVPdQ6pPo6ysPwWbji',
      response: 'fixture:listings/creative_marketing_full_response.json',
    })
    cy.route({
      method: 'GET',
      url:
        'http://localhost:8100/ob/ratings/QmYuz7HMF5SDMKjyUj3zCTqiq2rhAkWpDoxjhre8MLiHPN/fresh-ridges',
      response: 'fixture:ratings/empty.json',
    })
    cy.visit('http://localhost:3000/')
    cy.get(
      ':nth-child(1) > #Qmb1FjaFuXsVmvkhwQPEnuoNLR7izVPdQ6pPo6ysPwWbji > a > .listing-header'
    ).click()
    cy.contains('Retrieving Listing...')
    cy.contains('Creative Marketing').should('exist')
    cy.get('#price').should('have.html', '0.38')
    cy.get('#currency').should('have.html', 'USD')
    cy.contains('noren.arevalo@gmail.com')
    cy.contains('TBTC')
    cy.contains('Rave')
  })
})
