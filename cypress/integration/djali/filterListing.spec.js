/// <reference types="Cypress" />
/* global context, cy, Cypress */

context('Filter', () => {
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
      response: 'fixture:listings/search_many.json',
    }).as('filteredSearch')
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/chatconversations',
      response: [],
    })
    cy.visit('http://localhost:3000/')
  })

  it('Should verify request filters of listings and clear filter fields when Reset button is clicked', () => {
    // to ignore the first two calls of @filteredSearch route
    cy.wait('@filteredSearch')
    cy.wait('@filteredSearch')

    cy.get('#input').click()
    cy.get('#\\32 636-5').click()
    cy.wait('@filteredSearch')
    // selecting a Occupation filter triggers another @filteredSearch route

    cy.get('.uk-flex > :nth-child(1) > .uk-input').clear().type('10')
    cy.get(':nth-child(3) > .uk-input').type('99')
    cy.get(':nth-child(7) > .uk-input').type('Sample City')
    cy.get(':nth-child(8) > .uk-input').type('Sample State')
    cy.get(':nth-child(9) > .uk-input').type('8GC2CMXR+X6')
    cy.get(':nth-child(10) > .uk-select').select('Afghanistan')
    cy.get('[for="rate1_5"] > i').click()
    cy.get('.uk-range')
      .invoke('val', 200)
      .trigger('change')

    cy.get('.uk-button-primary').click()

    cy.wait('@filteredSearch').then(function(xhr) {
      const filters = xhr.requestBody.filters

      expect(filters[1]).to.equal(`containsInArr(doc.item.categories, "2636-5")`)
      expect(filters[2]).to.equal(`doc.location.city == "Sample City"`)
      expect(filters[3]).to.equal(`doc.location.state == "Sample State"`)
      expect(filters[4]).to.equal(`zipWithin("8GC2CMXR+X6", "AF", doc.location.zipCode, doc.location.country, 200000)`)
      expect(filters[5]).to.equal(`doc.location.country == "AF"`)
      expect(filters[6]).to.equal(`doc.averageRating >= "5"`)
      expect(filters[7]).to.equal(`doc.item.price >= 1000&& doc.item.price <= 9900`)
    })

    cy.get('.uk-button-default').click()

    cy.get('#input').should('be.empty')
    cy.get('.uk-flex > :nth-child(1) > .uk-input').should('be.empty')
    cy.get(':nth-child(3) > .uk-input').should('be.empty')
    cy.get(':nth-child(7) > .uk-input').should('be.empty')
    cy.get(':nth-child(8) > .uk-input').should('be.empty')
    cy.get(':nth-child(9) > .uk-input').should('be.empty')
    cy.get(':nth-child(10) > .uk-select').should('have.value', '')
    cy.get('[for="rate1_1"]').should('have.class', 'dv-star-rating-empty-star')
    cy.get('[for="rate1_2"]').should('have.class', 'dv-star-rating-empty-star')
    cy.get('[for="rate1_3"]').should('have.class', 'dv-star-rating-empty-star')
    cy.get('[for="rate1_4"]').should('have.class', 'dv-star-rating-empty-star')
    cy.get('[for="rate1_5"]').should('have.class', 'dv-star-rating-empty-star')
    cy.get('.uk-range').should('have.value', '1')
  })

  it('Should hide own listings', () => {
    cy.wait(2000)
    cy.route({
      method: 'POST',
      url: 'http://localhost:8109/djali/search',
      response: 'fixture:listings/search_many.json',
    }).as('ownerSearch')
    cy.get('#hideOwnListingCheckbox').click()
    cy.wait('@ownerSearch').then(function(xhr) {
      const filters = xhr.requestBody.filters
      const expected = [`doc.metadata.contractType == "SERVICE"`, `doc.vendorID.peerID != "QmciKksnTX5jVFGt5kCGzt3CTPmLMAfMWRKaFsU2N2fUrs"`, `doc.item.price >= 0`]
      cy.wrap(filters).should('deep.equal', expected)
    })
  })

  it('Should unhide own listings', () => {
    cy.wait(2000)
    cy.route({
      method: 'POST',
      url: 'http://localhost:8109/djali/search',
      response: 'fixture:listings/search_many.json',
    }).as('ownerSearch')
    cy.get('#hideOwnListingCheckbox').click()
    cy.wait('@ownerSearch').then(function(xhr) {
      const filters = xhr.requestBody.filters
      const expected = [`doc.metadata.contractType == "SERVICE"`, `doc.vendorID.peerID != "QmciKksnTX5jVFGt5kCGzt3CTPmLMAfMWRKaFsU2N2fUrs"`, `doc.item.price >= 0`]
      cy.wrap(filters).should('deep.equal', expected)
    })

    cy.get('#hideOwnListingCheckbox').click()
    cy.wait('@ownerSearch').then(function(xhr) {
      const filters = xhr.requestBody.filters
      const expected = [`doc.metadata.contractType == "SERVICE"`, `doc.item.price >= 0`]
      cy.wrap(filters).should('deep.equal', expected)
    })
  })
})