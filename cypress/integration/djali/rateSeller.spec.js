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
      url: 'http://localhost:8109/kimitzu/peer/*',
      response: 'fixture:profile/rating_buyer.json'
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
      url: 'http://localhost:8109/kimitzu/peer/get?id=sellerToBeRated',
      response: {}
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/chatmessages?limit&offsetId&subject=soldOrderThatWillBeRated',
      response: []
    })
    cy.route({
      method: 'GET',
      url: ' http://localhost:4002/ob/settings',
      response: 'fixture:settings/primary.json',
    })
    cy.route({
      method: 'POST',
      url: ' http://localhost:4002/ob/ordercompletion',
      response: []
    }).as('completeOrder')
    cy.visit('http://localhost:3000/#/history/purchases/soldOrderThatWillBeRated')
  })

  it('should verify the request of rating a seller (5 stars)', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/order/soldOrderThatWillBeRated',
      response: 'fixture:orders/sold_order_to_be_rated.json'
    })

    cy.get('.uk-textarea')
      .type('Sample Review for the seller on Text Area Input')

    cy.get('[for="overall_5"] > i')
      .click()
    cy.get('[for="quality_5"] > i')
      .click()
    cy.get('[for="description_5"] > i')
      .click()
    cy.get('[for="deliverySpeed_5"] > i')
      .click()
    cy.get('[for="customerService_5"] > i')
      .click()

    cy.get('#djali-btn')
      .click()

    cy.wait('@completeOrder').then(xhr => {
      const request = xhr.requestBody
      console.log(request)
      expect(request.orderId).to.equal('soldOrderThatWillBeRated')

      expect(request.ratings[0].customerService).to.equal(5)
      expect(request.ratings[0].deliverySpeed).to.equal(5)
      expect(request.ratings[0].description).to.equal(5)
      expect(request.ratings[0].overall).to.equal(5)
      expect(request.ratings[0].quality).to.equal(5)

      expect(request.ratings[0].review).to.equal('Sample Review for the seller on Text Area Input')
      expect(request.ratings[0].slug).to.equal('react-developer')
    })
  })

  it('should verify the request of rating a seller (0 stars)', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/order/soldOrderThatWillBeRated',
      response: 'fixture:orders/sold_order_to_be_rated.json'
    })

    cy.get('#djali-btn')
      .click()

    cy.wait('@completeOrder').then(xhr => {
      const request = xhr.requestBody
      console.log(request)
      expect(request.orderId).to.equal('soldOrderThatWillBeRated')

      expect(request.ratings[0].customerService).to.equal(0)
      expect(request.ratings[0].deliverySpeed).to.equal(0)
      expect(request.ratings[0].description).to.equal(0)
      expect(request.ratings[0].overall).to.equal(0)
      expect(request.ratings[0].quality).to.equal(0)

      expect(request.ratings[0].review).to.equal('')
      expect(request.ratings[0].slug).to.equal('react-developer')
    })
  })

  it('should verify values diplayed of a sold order that was completed and rated', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/order/soldOrderThatWillBeRated',
      response: 'fixture:orders/rated_sold_order.json'
    })

    cy.contains('A Sample Review for a Sold Order')
    cy.contains('Note or Comment when order was fulfilled')
  })
})