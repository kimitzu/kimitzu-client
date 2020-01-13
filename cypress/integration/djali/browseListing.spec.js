/// <reference types="Cypress" />

import Initialize from "../../support/utils/Initialize"

/* global context, cy, Cypress */

context('Browse Listing', () => {
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
    }).as('search')
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/chatconversations',
      response: [],
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/ratings/QmYuz7HMF5SDMKjyUj3zCTqiq2rhAkWpDoxjhre8MLiHPN/violin',
      response: {}
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
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/listing?hash=Qma4JZtoBvVdm2rSPtAy2Xfk8YqL2Gh36ANKWgS1Vto6hV',
      response: 'fixture:listings/violin.json'
    })
    cy.route({
      method: 'GET',
      url: ' http://localhost:8100/ob/settings',
      response: 'fixture:settings/primary.json', 
    })

    cy.visit('http://localhost:3000/')
  })

  it('should display detailed information of 2 Listings', () => {

    cy.get('#QmX63A8C9tfmnv9vzqjjPPCUuyoH7bD4Xsq4MdCG3xjU1C').click()
    cy.contains('Microsoft Office Suite Installation')
    cy.contains('Service')
    cy.contains('2521-0: Database Designers and Administrators')
    cy.contains('USD')
    cy.contains('20.00')
    cy.contains('Quality-focused Personal Loan Account bypass circuit web-enabled Lead Rustic Concrete Shirt leading edge Diverse feed regional Gloves Small Industrial sky blue Towels')
    cy.contains('Refined Cotton Computer partnerships Soap Intranet synthesize Books Garden International utilisation Cambodia monitor Security client-driven Persevering Handcrafted alarm approach capacitor scalable Games background Computer Director Cuban Peso Peso Convertible')

    cy.get('.uk-breadcrumb > :nth-child(1) > .uk-text-capitalize').click()
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