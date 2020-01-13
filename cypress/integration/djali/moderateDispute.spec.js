/// <reference types="Cypress" />

import Initialize from "../../support/utils/Initialize"

/* global context, cy, Cypress */

context('Filter', () => {
  beforeEach(() => {
    cy.server({})

    Initialize(cy)

    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/exchangerate/btc',
      response: {}
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/moderators?async=true',
      response: {}
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/*',
      response: 'fixture:profile/moderator.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/case/QmP4bZDCpsb5DMZnTKDoaUGzeGrnySYMbS6wrTyegV5QUW',
      response: 'fixture:case/disputed_case.json'
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
      url: 'http://localhost:8100/ob/chatconversations',
      response: [],
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/get?id=QmYWEo2SzZVkQHirvwB1gSNwgVHAN5xXuynYgvWvC9VcNa',
      response: 'fixture:profile/disputing_seller.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/get?id=QmUfBkVYxcXVmwbuT1skUMRjxtk9LKx3mgRcE2kGiUS2Vp',
      response: 'fixture:profile/disputed_buyer.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/chatmessages?limit&offsetId&subject=QmP4bZDCpsb5DMZnTKDoaUGzeGrnySYMbS6wrTyegV5QUW',
      response: []
    })
    cy.route({
      method: 'GET',
      url: ' http://localhost:8100/ob/settings',
      response: 'fixture:settings/primary.json',
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8100/ob/closedispute',
      response: {}
    }).as('closeDispute')


    cy.visit('http://localhost:3000/#/history/cases/QmP4bZDCpsb5DMZnTKDoaUGzeGrnySYMbS6wrTyegV5QUW')
  })

  it('should verify the request of resolving a dispute', () => {
    cy.contains('You have an hour to process the dispute and make a decision.')
    cy.contains('El Professor is disputing the order')

    cy.get('#kimitzu-btn')
      .click()

    cy.get('.handle-0')
      .invoke('attr', 'aria-valuenow', '50')
    cy.get('.uk-textarea')
      .type('Sample Resolution to be typed in a text area')
    cy.get('#kimitzu-btn')
      .click()

    cy.wait('@closeDispute').then((xhr) => {
      expect(xhr.requestBody.resolution).to.equal('Sample Resolution to be typed in a text area')
      expect(xhr.requestBody.buyerPercentage).to.equal(100)
      expect(xhr.requestBody.vendorPercentage).to.equal(0)
      expect(xhr.requestBody.orderId).to.equal('QmP4bZDCpsb5DMZnTKDoaUGzeGrnySYMbS6wrTyegV5QUW')
    })
  })
})