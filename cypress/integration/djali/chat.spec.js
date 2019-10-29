/// <reference types="Cypress" />
/* global context, cy, Cypress */

import WebSocketMock from "../../support/utils/WebSocketMock"
import { WebSocket } from 'mock-socket';

let webSocketMock = new WebSocketMock('ws://localhost:4002/ws')

context('Chat', () => {
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
      url: 'http://localhost:8109/djali/peer/get?id=&force=true',
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
      response: 'fixture:listings/search.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/chatconversations',
      response: 'fixture:chat/peopleChattedWith.json',
    })
    cy.route({
      method: 'GET',
      url: '/ob/chatmessages/peerId1?limit=20&offsetId=&subject=',
      response: 'fixture:chat/person1.json',
    })
    cy.route({
      method: 'GET',
      url: '/ob/chatmessages/peerId2?limit=20&offsetId=&subject=',
      response: 'fixture:chat/person2.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/peer/get?id=moderator',
      response: 'fixture:profile/moderator.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/peer/get?id=peerId1',
      response: 'fixture:peers/peer1.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/peer/get?id=peerId2',
      response: 'fixture:peers/peer2.json'
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/ob/chat',
      response: {}
    }).as('sendChat')
    cy.route({
      method: 'GET',
      url: ' http://localhost:4002/ob/settings',
      response: 'fixture:settings/primary.json',
    })

    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        cy.stub(win, "WebSocket", url => new WebSocket('ws://localhost:4002/ws'))
      }
    })
  })

  it('should display expected chat values', () => {
    cy.get('#header-left')
      .click()
    cy.get('#convo0 > .convos-message-cont > .convos-message-header > .message-time')
      .contains('10/9/2020')
    cy.get('#convo0 > .convos-message-cont > .convos-message-teaser > .message')
      .contains('last message on peer 1')
    cy.get('#convo0')
      .click()
    cy.get('.text-msg-right')
      .contains('1st message')
    cy.get('.text-msg-left')
      .contains('last message on peer 1')

    cy.get('#convo1 > .convos-message-cont > .convos-message-header > .message-time')
      .contains('10/9/2019')
    cy.get('#convo1 > .convos-message-cont > .convos-message-teaser > .message')
      .contains('last message on peer 2')
    cy.get('#convo1 ')
      .click()
    cy.get('.text-msg-left')
      .contains('1st message')
    cy.get('.text-msg-right')
      .contains('2nd message')
    cy.get('.text-msg-right')
      .contains('3rd message')
    cy.get('.text-msg-left')
      .contains('4th message')
    cy.get('.text-msg-left')
      .contains('5th message')
    cy.get('.text-msg-right')
      .contains('last message on peer 2')

    cy.get('#chat-input')
      .type('A sample new message')
    cy.get('#message-button-cont-two')
      .click()
    cy.get('.text-msg-right')
      .contains('A sample new message')

    cy.wait('@sendChat').then((xhr) => {
      expect(xhr.requestBody.message).to.equal("A sample new message")
      expect(xhr.requestBody.peerId).to.equal("peerId2")
      expect(xhr.requestBody.subject).to.equal("")
    })

    setTimeout(() => {
      webSocketMock.sendMsg(`{"message":
        {
          "message":"A Sample Discussion Message that Responds",
          "messageId":"QmT3WwLjh6f9jkAJFM1GN7Udo8R8tAKwcL7LTRNTvM6RAu",
          "outgoing":false,
          "peerId":"peerId2",
          "read":false,
          "subject":"",
          "timestamp":"2019-10-09T19:04:29.7451483+08:00"
        }
      }`)
    }, 5000)

    cy.get(':nth-child(8) > .text-msg-left')
      .contains('A Sample Discussion Message that Responds', {
        timeout: 10000
      })
  })
})