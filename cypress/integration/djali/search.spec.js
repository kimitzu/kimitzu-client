/// <reference types="Cypress" />
/* global context, cy, Cypress */

context('Register', () => {
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
          response: 'fixture:API/currency.json'
        })
        cy.route({
          method: 'GET',
          url: 'http://localhost:4002/ob/moderators?async=true',
          response: {}
        })
        cy.visit('http://localhost:3000/')
      })
  
    it('Should see all entries in search', () => {
        cy.contains('Fresh Ridges').should('exist')
        cy.contains('0.27 USD').should('exist')
    })

    it('Should properly convert to another currency', () => {
        cy.route({
            method: 'GET',
            url: 'http://localhost:8109/djali/peer/*',
            response: 'fixture:profile/vendor_philippines.json',
        })
        cy.contains('Fresh Ridges').should('exist')
        cy.contains('14.05 PHP').should('exist')
    })

    it('Should open a listing', () => {
        cy.route({
            method: 'POST',
            url: 'http://localhost:8109/djali/listing?hash=QmX2RxNnBj3AqTwpcoSmnytG6a56sE9ZZJWk8apQWpsBSF',
            response: 'fixture:listings/entry_fresh_ridges.json',
        })
        cy.route({
            method: 'GET',
            url: 'http://localhost:4002/ob/ratings/QmYuz7HMF5SDMKjyUj3zCTqiq2rhAkWpDoxjhre8MLiHPN/fresh-ridges',
            response: 'fixture:ratings/empty.json',
        })
        cy.get('#QmX2RxNnBj3AqTwpcoSmnytG6a56sE9ZZJWk8apQWpsBSF > a > :nth-child(1) > .img-list').click()
        cy.contains('Retrieving Listing...')
        cy.contains('Fresh Ridges').should('exist')
        cy.contains('2512-0: Software Developers').should('exist')
        cy.get('.priceSize').should('have.html', '0.27 USD/hour')
        cy.contains('noren.arevalo@gmail.com')
        cy.contains('Bitcoin (TBTC)')
        cy.contains('Brand Organic Planner overriding Cotton Montana application Practical Soap clicks-and-mortar card back-end Toys Handcrafted proactive Licensed Wooden Pizza Credit Card Account Fresh needs-based architectures Bedfordshire Intelligent Cotton Table Intranet Team-oriented')
        cy.contains('Rave')
    })
  })
  