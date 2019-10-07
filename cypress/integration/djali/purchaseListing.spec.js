import WebSocketMock from "../utils/WebSocketMock.js"
import { WebSocket } from 'mock-socket';

/// <reference types="Cypress" />
/* global context, cy, Cypress */

let webSocketMock = new WebSocketMock('ws://localhost:4002/ws')

context('Purchase', () => {
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
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/chatconversations',
      response: [],
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
      url: 'http://localhost:8109/djali/listing?hash=QmX63A8C9tfmnv9vzqjjPPCUuyoH7bD4Xsq4MdCG3xjU1C',
      response: 'fixture:listings/microsoft_office_installation.json'
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/ob/estimatetotal',
      response: 4805
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/ob/purchase',
      response: {
        "amount": 4805
      }
    }).as('purchase')
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        cy.stub(win, "WebSocket", url => new WebSocket('ws://localhost:4002/ws'))
      }
    })
  })

  it('should checkout a listing', () => {
    cy.get('#QmPxqKM4iBJMV3HgJpAZCc4MNv59Wx6pUVSjPc3HN7sZFn').click()
    cy.get('#djali-btn').click()
    cy.get('.uk-form-controls > :nth-child(1) > .uk-radio').click()

    cy.contains('Microsoft Office Suite Installation')
    cy.contains('20.00')
    cy.get(':nth-child(3) > #listing-checkout-card-side-data > p').contains('1')
    cy.contains('PLACE ORDER NOW')
    cy.get('.uk-form-controls > :nth-child(1) > .uk-radio').should('be.checked')
    cy.contains('0.00004805')

    cy.get('#djali-btn').click()

    setTimeout(() => {
      webSocketMock.sendMsg()
    }, 5000)

    cy.wait('@purchase').then(function(xhr) {
      const request = xhr.requestBody

      expect(request.paymentCoin).to.equal('TBTC')
      expect(request.items[0].listingHash).to.equal('QmX63A8C9tfmnv9vzqjjPPCUuyoH7bD4Xsq4MdCG3xjU1C')
      expect(request.items[0].quantity).to.equal(1)
    })

    cy.get('#payment-modal').contains('0.00004805', {timeout: 15000})
  })
})