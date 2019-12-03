/// <reference types="Cypress" />
/* global context, cy, Cypress */

context('Profile', () => {
  beforeEach(() => {
    cy.server({})
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/*',
      response: 'fixture:profile/vendor.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/get?id=moderator',
      response: 'fixture:profile/moderator.json',
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
      response: 'fixture:listings/search.json',
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
      url: 'http://localhost:4002/ob/ratings/QmciKksnTX5jVFGt5kCGzt3CTPmLMAfMWRKaFsU2N2fUrs',
      response: {},
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/isfollowing/undefined',
      response: {}, //TODO Fixture
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/followers',
      response: [], //TODO Followers Fixture
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/following',
      response: [], //TODO Following Fixture
    })
    cy.route({
      method: 'POST',
      url: ' http://localhost:4002/ob/images',
      response: 'fixture:images/listing.json',
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/ob/listing',
      response: {
        slug: 'The-Accountant',
      },
    }).as('newListing')
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/ob/publish',
      response: {},
    })
    cy.route({
      method: 'PUT',
      url: 'http://localhost:4002/ob/profile',
      response: {},
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/listing?hash=*',
      response: 'fixture:listings/creative_marketing_full_response.json',
    })
    cy.visit('http://localhost:3000/')
  })

  it('should display expected values on Profile Tab', () => {
    cy.get('#account').click()
    cy.get('#account').click()
    cy.get('#view-profile').click()

    cy.get('#title-about').contains('About')

    cy.get('.markdown-container > :nth-child(1)').contains(
      'I am a software engineer most knowledgeable in developing web applications using NodeJS, Express, React, MongoDB, and Mocha.'
    )

    cy.get('.markdown-container > :nth-child(2)')
      .contains(
        'I mostly have academic experience in developing desktop, mobile, and web applications using the following tools and technologies'
      )
      .contains('• Blockchain: Ethereum, Solidity')
      .contains('• Front end: React, Angular, Angular2, Bootstrap, Material-UI')
      .contains('• Back end: NodeJS (with ExpressJS or FeathersJS), PHP, Symfony')
      .contains('• Database: MongoDB, MySQL')
      .contains('• Testing: Mocha, Chimp')
      .contains('• Desktop app: Java')
      .contains('• Mobile app: MeteorJS, Cordova, Android-Native, React-Native')
      .contains('• Other Technologies Used: Git, Gitlab CI/CD, Remix, VSCode, Ubuntu')

    cy.get('#title-social-media').contains('Social Media')

    cy.contains('Email')
    cy.contains('noren.arevalo@gmail.com')

    // cy.contains('Twitter') <- cannot be found
    cy.contains('@24th_saint')

    cy.get('#title-other-information').contains('Other Information')

    cy.contains('Peer ID')
    cy.contains('QmciKksnTX5jVFGt5kCGzt3CTPmLMAfMWRKaFsU2N2fUrs')

    cy.contains('Location')
    cy.contains('PH,')

    cy.contains('Username')
    cy.contains('Rave')
  })

  it('should display expected values on Store Tab', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/ratings/QmciKksnTX5jVFGt5kCGzt3CTPmLMAfMWRKaFsU2N2fUrs',
      response: {},
    })

    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/ratings/QmciKksnTX5jVFGt5kCGzt3CTPmLMAfMWRKaFsU2N2fUrs',
      response: {},
    })

    cy.wait(200)

    cy.get('#account').click()
    cy.get('#account').click()
    cy.get('#view-profile').click()
    cy.get('#desktop-store-tab-label').click()

    cy.get('#Qmb1FjaFuXsVmvkhwQPEnuoNLR7izVPdQ6pPo6ysPwWbji').contains('Creative Marketing')

    cy.contains('USD')
    cy.contains('0.38')
  })

  it('should display expected values on Ratings Tab', () => {
    cy.get('#account').click()
    cy.get('#account').click()
    cy.get('#view-profile').click()
    cy.get('#desktop-ratings-tab-label').click()

    cy.contains('Buyer Ratings')
    cy.get(
      '.divider > .uk-padding-small > :nth-child(1) > :nth-child(1) > .uk-flex-1 > h4'
    ).contains('0/5')

    cy.contains('Fairness (0)')
    cy.contains('Careful Reader (0)')
    cy.contains('Accuracy (0)')
    cy.contains('Responsiveness (0)')

    cy.contains('Seller Ratings')
    cy.get(
      ':nth-child(2) > .uk-padding-small > :nth-child(1) > :nth-child(1) > .uk-flex-1 > h4'
    ).contains('0/5')

    cy.contains('Overall (0)')
    cy.contains('Quality (0)')
    cy.contains('As Advertised (0)')
    cy.contains('Delivery (0)')
    cy.contains('Service (0)')
  })

  //TODO Followers Tab
  //TODO Following Tab
  //TODO Sales History Tab
  //TODO Purchase History Tab
})
