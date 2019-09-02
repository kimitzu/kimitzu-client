/// <reference types="Cypress" />
/* global context, cy, Cypress */

context('Register', () => {
  beforeEach(() => {
    cy.server({
      status: 200,
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/peer/get?id=&force=false',
      status: 404,
      response: 'fixture:profile/empty.json',
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/ob/profile',
      response: {},
    }).as('createProfile')
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/ob/images',
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
      url: 'http://localhost:4002/ob/publish',
      response: {},
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/authenticate',
      response: { authenticated: false },
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8109/djali/search',
      response: 'fixture:listings/empty.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/chatconversations',
      response: [],
    })

    cy.visit('http://localhost:3000/register')
  })

  it('Should register an account', () => {
    cy.wait(5000)
    cy.contains('A free market for services')
    cy.contains('GET STARTED').click()
    cy.fixture('avatar.jpg').then(fileContent => {
      cy.get('#avatar-upload').upload({
        fileContent,
        fileName: 'avatar.jpg',
        mimeType: 'image/jpg',
      })
    })
    cy.get('#username').type('Djali')
    cy.get('#fullname').type('Djali Remote')
    cy.get('#description').type('Lorem ipsum dolor sit amet.')
    cy.get('#email').type('test@djali.org')
    cy.get('#countries').select('Philippines')
    cy.get('#preferred-units').select('Metric System (Kilometer, Meter, Centimeter, Grams)')
    cy.get('[type="submit"]').click()
    cy.get('#terms').should(
      'contain.text',
      `The Djali community of developers has worked hard to deliver a free market for services. But as with any software, there will be bugs. Djali users may also encounter trolls, spammers, thieves, and other bad actors while using the app. Djali developers will continuously work to provide tools to users that will help them identify, block, and remove bad actors from the Djali ecosystem. However, these tools may fail at times. The developers are not responsible for any monetary loss associated with the software.`
    )

    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/peer/get?id=&force=false',
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
        handle: 'Djali',
        moderator: false,
        moderatorInfo: {
          description: '',
          termsAndConditions: '',
          languages: [],
          acceptedCurrencies: [],
          fee: { fixedFee: { currencyCode: '', amount: 0 }, percentage: 0, feeType: 'FIXED' },
        },
        name: 'Djali Remote',
        nsfw: false,
        vendor: true,
        contactInfo: { website: '', email: 'test@djali.org', phoneNumber: '', social: [] },
        bitcoinPubkey: '',
        currencies: [],
        headerHashes: { tiny: '', small: '', medium: '', large: '', original: '' },
        location: 'PH, ',
        metaTags: { DjaliVersion: '' },
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
      }
      console.log(JSON.stringify(profile.requestBody))
      cy.wrap(expectedProfile).should('deep.equal', profile.requestBody)
    })

    cy.get('#djali-text').should('contain.html', 'Welcome to DJALI, Djali Remote!')
    cy.get('#home').click()
    cy.wait(5000)
    cy.get('#empty-results')
      .should('be.visible')
      .should('contain.text', 'No Results')
  })
})
