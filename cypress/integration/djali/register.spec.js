/// <reference types="Cypress" />
/* global context, cy, Cypress */

context('Register', () => {
  beforeEach(() => {
    cy.server({
      status: 200,
    })

    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/config',
      response: {}
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peers',
      response: {},
    })

    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/get?id=&force=true', 
      status: 404,
      response: 'fixture:profile/empty.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/get?id=moderator',
      response: 'fixture:profile/moderator.json'
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8100/ob/profile',
      response: {},
    }).as('createProfile')
    cy.route({
      method: 'POST',
      url: 'http://localhost:8100/ob/images',
      response: [
        {
          filename: 'image.png',
          hashes: {
            large: 'QmWakC1FFwRhPfQbHvTTR3RDys7pHsppSCWWGwHnziPRj5',
            medium: 'QmP2CS44tS21PBm9ehFdE9eqLZbwx6Cuxoj4djzGShHpaK',
            original: 'QmRSxi1F9T3HMYBVSJKCQetV9A4brhXU96o5PrzMzPuykE',
            small: 'QmQXZUA2a7Rc3jHPojN7rx29NtBMQY6RRAg3Ku5r4xNvwX',
            tiny: 'QmeudWfRNBRdJp9Lv6HV2XU6Q2fL5ZNXLYX45e7NkvFvY8',
          },
        },
      ],
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8100/ob/publish',
      response: {},
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/authenticate',
      status: 404,
      response: { authenticated: false },
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8109/kimitzu/search',
      response: 'fixture:listings/empty.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/chatconversations',
      response: [],
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/exchangerate/btc',
      response: {},
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/moderators?async=true',
      response: {},
    })
    cy.route({
      method: 'GET',
      url: ' http://localhost:8100/ob/settings',
      response: 'fixture:settings/primary.json',
    })

    cy.visit('http://localhost:3000/', { failOnStatusCode: false })
  })

  it('Should register an account', () => {
    cy.wait(5000)
    cy.contains('A free market for services')
    cy.get('#kimitzu-btn').click()
    cy.fixture('avatar.jpg').then(fileContent => {
      cy.get('#avatar-upload').upload({
        fileContent,
        fileName: 'avatar.jpg',
        mimeType: 'image/jpg',
      })
    })
    cy.get('#username').type('Kimitzu')
    cy.get('#fullname').type('Kimitzu Remote')
    cy.get('.mde-text').type('Lorem ipsum dolor sit amet.')
    cy.get('#email').type('test@kimitzu.ch')
    cy.get('#countries').select('Philippines')
    cy.get('#preferred-units').select('Metric System (Kilometer, Meter, Centimeter, Grams)')
    cy.get('[type="submit"]').click()
    cy.get('#terms').should(
      'contain.text',
      `The Kimitzu community of developers has worked hard to deliver a free market for services. But as with any software, there will be bugs. Kimitzu users may also encounter trolls, spammers, thieves, and other bad actors while using the app. Kimitzu developers will continuously work to provide tools to users that will help them identify, block, and remove bad actors from the Kimitzu ecosystem. However, these tools may fail at times. The developers are not responsible for any monetary loss associated with the software.`
    )

    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/get?id=&force=true',
      response: 'fixture:profile/vendor.json',
    })

    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/get?id=&force=false',
      response: 'fixture:profile/vendor.json',
    })

    cy.contains('I AGREE').click()

    cy.wait('@createProfile').then(profile => {
      const expectedProfile = {
        about: 'Lorem ipsum dolor sit amet.',
        avatarHashes: {
          large: 'QmWakC1FFwRhPfQbHvTTR3RDys7pHsppSCWWGwHnziPRj5',
          medium: 'QmP2CS44tS21PBm9ehFdE9eqLZbwx6Cuxoj4djzGShHpaK',
          original: 'QmRSxi1F9T3HMYBVSJKCQetV9A4brhXU96o5PrzMzPuykE',
          small: 'QmQXZUA2a7Rc3jHPojN7rx29NtBMQY6RRAg3Ku5r4xNvwX',
          tiny: 'QmeudWfRNBRdJp9Lv6HV2XU6Q2fL5ZNXLYX45e7NkvFvY8',
          filename: 'image.png',
        },
        extLocation: {
          primary: 0,
          shipping: 0,
          billing: 0,
          return: 0,
          addresses: [{ country: 'PH' }],
        },
        handle: 'Kimitzu',
        moderator: false,
        moderatorInfo: {
          description: '',
          termsAndConditions: '',
          languages: [],
          acceptedCurrencies: [],
          fee: { fixedFee: { currencyCode: 'USD', amount: 0 }, percentage: 0, feeType: 'FIXED' },
        },
        name: 'Kimitzu Remote',
        nsfw: false,
        vendor: true,
        contactInfo: { website: '', email: 'test@kimitzu.ch', phoneNumber: '', social: [] },
        bitcoinPubkey: '',
        currencies: [],
        headerHashes: { tiny: '', small: '', medium: '', large: '', original: '' },
        location: 'PH, ',
        metaTags: { KimitzuVersion: '' },
        peerID: '',
        preferences: {
          currencyDisplay: 'FIAT',
          fiat: 'USD',
          cryptocurrency: 'TBTC',
          language: 'en-US',
          measurementUnit: 'METRIC',
        },
        profileType: '',
        shortDescription: '',
        stats: {
          followerCount: 0,
          followingCount: 0,
          listingCount: 0,
          ratingCount: 0,
          postCount: 0,
          averageRating: 0,
        },
        background: { educationHistory: [], employmentHistory: [] },
        spokenLanguages: ['English', 'Tagalog'],
        programmingLanguages: ['Javascript', 'Golang', 'C++'],
        customFields: [],
        customProps: { programmerCompetency: '{}', competencies: '', skills: '[]' },
      }
      cy.wrap(expectedProfile).should('deep.equal', profile.requestBody)
    })

    cy.get('#kimitzu-text').should('contain.html', 'Welcome to KIMITZU, Kimitzu Remote!')

    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/authenticate',
      status: 200,
      response: { authenticated: false },
    })

    cy.get('#home').click()
    cy.wait(5000)
    cy.get('#empty-results')
      .should('be.visible')
      .should('contain.text', 'No Results')
  })
})
