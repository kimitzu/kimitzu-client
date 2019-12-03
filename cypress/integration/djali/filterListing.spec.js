/// <reference types="Cypress" />
/* global context, cy, Cypress */

context('Filter', () => {
  beforeEach(() => {
    cy.server({})
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/exchangerate/btc',
      response: {},
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/moderators?async=true',
      response: {},
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
        authenticated: false,
      },
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8109/kimitzu/search',
      response: 'fixture:listings/search_many.json',
    }).as('filteredSearch')
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
      method: 'GET',
      url: ' http://localhost:8109/kimitzu/listing?hash=*',
      response: 'fixture:listings/creative_marketing_full_response.json',
    })
    cy.visit('http://localhost:3000/')
  })

  it('Should verify request filters of listings and clear filter fields when Reset button is clicked', () => {
    // To ignore the first two calls of @filteredSearch route.
    cy.wait('@filteredSearch')
    cy.wait('@filteredSearch')

    cy.get('#sidebar-desktop-autocomplete').click()
    cy.get('#sidebar-desktop-autocomplete-2636-5').click()

    // selecting an Occupation Filter triggers another @filteredSearch route, ignore.
    cy.wait('@filteredSearch')

    cy.get('#sidebar-desktop-price-min')
      .clear()
      .type('10')
    cy.get('#sidebar-desktop-price-max').type('99')
    cy.get('#sidebar-desktop-location-city').type('Sample City')
    cy.get('#sidebar-desktop-location-state').type('Sample State')
    cy.get('#sidebar-desktop-location-pluscode').type('8GC2CMXR+X6')
    cy.get('#sidebar-desktop-location-country').select('Afghanistan')
    cy.get('[for="rate1_5"] > i').click({ multiple: true, force: true })
    cy.get('#sidebar-desktop-radius-range')
      .invoke('val', 200)
      .trigger('change')

    cy.get('#sidebar-desktop-submit').click()

    cy.wait('@filteredSearch').then(function(xhr) {
      const filters = xhr.requestBody.filters
      filters.sort()

      const expected = [
        'containsInArr(doc.item.categories, "2636-5")',
        'doc.item.price >= 1000&& doc.item.price <= 9900',
        'doc.location.city == "Sample City"',
        'doc.location.country == "AF"',
        'doc.location.state == "Sample State"',
        'doc.metadata.contractType == "SERVICE"',
        'geoWithin("38.44993750000002", "20.690562499999984", doc.location.latitude, doc.location.longitude, 200000)',
      ]

      expect(filters).to.deep.equal(expected)
    })

    cy.get('#sidebar-desktop-reset').click()

    cy.get('#sidebar-desktop-autocomplete').should('be.empty')
    cy.get('#sidebar-desktop-price-min').should('have.value', '0')
    cy.get('#sidebar-desktop-price-max').should('be.empty')
    cy.get('#sidebar-desktop-location-pluscode').should('be.empty')
    cy.get('#sidebar-desktop-location-city').should('be.empty')
    cy.get('#sidebar-desktop-location-state').should('be.empty')
    cy.get('#sidebar-desktop-location-country').should('have.value', '')
    cy.get('[for="rate1_1"]').should('have.class', 'dv-star-rating-empty-star')
    cy.get('[for="rate1_2"]').should('have.class', 'dv-star-rating-empty-star')
    cy.get('[for="rate1_3"]').should('have.class', 'dv-star-rating-empty-star')
    cy.get('[for="rate1_4"]').should('have.class', 'dv-star-rating-empty-star')
    cy.get('[for="rate1_5"]').should('have.class', 'dv-star-rating-empty-star')
    cy.get('#sidebar-desktop-radius-range').should('have.value', '1')
  })

  it('Should hide own listings', () => {
    cy.wait(2000)
    cy.route({
      method: 'POST',
      url: 'http://localhost:8109/kimitzu/search',
      response: 'fixture:listings/search_many.json',
    }).as('ownerSearch')
    cy.get('#sidebar-desktop-hideOwnListingCheckbox').click()
    cy.wait('@ownerSearch').then(function(xhr) {
      const filters = xhr.requestBody.filters
      const expected = [
        `doc.metadata.contractType == "SERVICE"`,
        `doc.vendorID.peerID != "QmciKksnTX5jVFGt5kCGzt3CTPmLMAfMWRKaFsU2N2fUrs"`,
        `doc.item.price >= 0`,
      ]
      cy.wrap(filters).should('deep.equal', expected)
    })
  })

  it('Should unhide own listings', () => {
    cy.wait(2000)
    cy.route({
      method: 'POST',
      url: 'http://localhost:8109/kimitzu/search',
      response: 'fixture:listings/search_many.json',
    }).as('ownerSearch')
    cy.get('#sidebar-desktop-hideOwnListingCheckbox').click()
    cy.wait('@ownerSearch').then(function(xhr) {
      const filters = xhr.requestBody.filters
      const expected = [
        `doc.metadata.contractType == "SERVICE"`,
        `doc.vendorID.peerID != "QmciKksnTX5jVFGt5kCGzt3CTPmLMAfMWRKaFsU2N2fUrs"`,
        `doc.item.price >= 0`,
      ]
      cy.wrap(filters).should('deep.equal', expected)
    })

    cy.get('#sidebar-desktop-hideOwnListingCheckbox').click()
    cy.wait('@ownerSearch').then(function(xhr) {
      const filters = xhr.requestBody.filters
      const expected = [`doc.metadata.contractType == "SERVICE"`, `doc.item.price >= 0`]
      cy.wrap(filters).should('deep.equal', expected)
    })
  })
})
