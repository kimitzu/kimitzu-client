/// <reference types="Cypress" />
/* global context, cy, Cypress */

import WebSocketMock from "../../support/utils/WebSocketMock"
import { WebSocket } from 'mock-socket';
import Initialize from "../../support/utils/Initialize";

let webSocketMock = new WebSocketMock('ws://localhost:8100/ws')

context('Purchase', () => {
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
      url: 'http://localhost:8109/kimitzu/search',
      response: 'fixture:listings/search.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/chatconversations',
      response: [],
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/ratings/QmYuz7HMF5SDMKjyUj3zCTqiq2rhAkWpDoxjhre8MLiHPN/microsoft-office-suite-installation',
      response: {}
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/listing?hash=QmX63A8C9tfmnv9vzqjjPPCUuyoH7bD4Xsq4MdCG3xjU1C',
      response: 'fixture:listings/microsoft_office_installation.json'
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8100/ob/estimatetotal',
      response: 4805
    })
    cy.route({
      method: 'GET',
      url: ' http://localhost:8100/ob/settings',
      response: 'fixture:settings/primary.json',
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8100/ob/purchase',
      response: {
        "amount": 4805
      }
    }).as('purchase')
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        cy.stub(win, "WebSocket", url => new WebSocket('ws://localhost:8100/ws'))
      }
    })
  })

  it('should checkout a listing', () => {
    cy.wait(2000)
    cy.get('#QmX63A8C9tfmnv9vzqjjPPCUuyoH7bD4Xsq4MdCG3xjU1C').click()
    cy.get('#checkout').click()
    cy.get('#desktop-TBTC').click()

    cy.contains('Microsoft Office Suite Installation')
    cy.contains('20.00')
    cy.get(':nth-child(3) > #listing-checkout-card-side-data > p').contains('1')
    cy.contains('PLACE ORDER NOW')
    cy.get('#desktop-TBTC').should('be.checked')
    cy.contains('0.00004805')

    cy.get('#desktop-place-order-button').click()
    cy.get('#pay').click()
    cy.get('#kimitzu-btn').click().then(() => {
      const socketMessage = {
        "notification": {
          "coinType": "TBTC",
          "fundingTotal": 4805,
          "notificationId": "QmPjf7PKW6Bx58A7yWDsAuvpu6MrMKJWRAt19WPom7MzuP",
          "orderId": "QmfBMEAAhmvTzktS31QAwPKj89kiyhSDJeUZBx1vyHLkfd",
          "type": "payment"
        }
      }
      webSocketMock.sendMsg(`${JSON.stringify(socketMessage)}`)
    })

    cy.wait('@purchase').then(function (xhr) {
      const request = xhr.requestBody

      expect(request.paymentCoin).to.equal('TBTC')
      expect(request.items[0].listingHash).to.equal('QmX63A8C9tfmnv9vzqjjPPCUuyoH7bD4Xsq4MdCG3xjU1C')
      expect(request.items[0].quantity).to.equal(1)
    })

    cy.get('#payment-modal-amount', { timeout: 10000 }).should('be.visible')
    cy.get('#payment-modal-amount').should('have.html', '0.00004805')
  })
})