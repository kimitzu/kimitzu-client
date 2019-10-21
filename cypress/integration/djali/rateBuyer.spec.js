/// <reference types="Cypress" />
/* global context, cy, Cypress */

context('Rate Buyer', () => {
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
      response: 'fixture:profile/rating_seller.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/authenticate',
      response: {
        authenticated: false
      },
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/chatconversations',
      response: [],
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/peer/get?id=sellerToRate',
      response: {}
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/peer/get?id=buyerToBeRated',
      response: {}
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/chatmessages?limit&offsetId&subject=purchasedListingToBeRated',
      response: []
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/ob/orderfulfillment',
      response: {}
    }).as('fulfillOrder')

    cy.visit('http://localhost:3000/#/history/sales/purchasedListingToBeRated')
  })

  it('should verify the request of rating a buyer (5 stars)', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/order/purchasedListingToBeRated',
      response: 'fixture:orders/purchased_order_to_be_rated.json',
    }
    )
    cy.get('#djali-btn')
      .click()

    cy.get('[for="compensationFairness_5"] > i')
      .click()
    cy.get('[for="carefulReader_5"] > i')
      .click()
    cy.get('[for="accurateWorkDescription_5"] > i')
      .click()
    cy.get('[for="responsiveness_5"] > i')
      .click()

    cy.get(':nth-child(1) > .uk-textarea')
      .type('Sample Text Area Review')
    cy.get(':nth-child(2) > .uk-textarea')
      .type('Sample Note')

    cy.get('#djali-btn')
      .click()

    cy.wait('@fulfillOrder').then((xhr) => {
      const request = xhr.requestBody

      expect(request.buyerRating.fields[0].score).to.equal(5)
      expect(request.buyerRating.fields[1].score).to.equal(5)
      expect(request.buyerRating.fields[2].score).to.equal(5)
      expect(request.buyerRating.fields[3].score).to.equal(5)

      expect(request.orderId).to.equal('purchasedListingToBeRated')
      expect(request.note).to.equal('Sample Note')
    })
  })

  it('should verify the request of rating a buyer (0 stars)', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/order/purchasedListingToBeRated',
      response: 'fixture:orders/purchased_order_to_be_rated.json',
    })

    cy.get('#djali-btn')
      .click()

    cy.get('#djali-btn')
      .click()

    cy.wait('@fulfillOrder').then((xhr) => {
      const request = xhr.requestBody

      expect(request.buyerRating.fields[0].score).to.equal(0)
      expect(request.buyerRating.fields[1].score).to.equal(0)
      expect(request.buyerRating.fields[2].score).to.equal(0)
      expect(request.buyerRating.fields[3].score).to.equal(0)
    })
  })

  it('should verify displayed values when of a purchased order that was fulfilled and rated', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/order/purchasedListingToBeRated',
      response: 'fixture:orders/rated_purchased_order.json',
    })

    cy.contains('This is the value of the rating of an user to your purchase')
  })
})