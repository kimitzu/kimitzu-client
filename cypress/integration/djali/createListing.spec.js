/// <reference types="Cypress" />
/* global context, cy, Cypress */

context('Register', () => {
  beforeEach(() => {
    cy.server({})
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/peer/*',
      response: 'fixture:profile/vendor.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/djali/peer/get?id=moderator',
      response: 'fixture:profile/moderator.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/authenticate',
      response: { authenticated: false },
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
      url: ' http://localhost:4002/ob/settings',
      response: 'fixture:settings/primary.json',
    })
    cy.route({
      method: 'POST',
      url: ' http://localhost:4002/ob/images',
      response: 'fixture:images/listing.json',
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/ob/listing',
      response: { slug: 'The-Accountant' },
    }).as('newListing')
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/ob/publish',
      response: {},
    })
    cy.visit('http://localhost:3000/')
  })

  it('Should create a listing', async () => {
    cy.wait(5000)
    cy.get('#account').click()
    cy.contains('Create New Listing').click()
    cy.contains('General')
    cy.get('#form-select').click()
    cy.get('#2411-24').click()
    cy.get('#general-title').type('The Accountant')
    cy.get('#general-type').select('Service')
    cy.get('#selector-input-general-price').clear()
    cy.get('#selector-input-general-price').type('15')
    cy.get('#general-rate-method').select('Hourly')
    cy.get('#general-desc').type('Lorem ipsum dolor sit amet, consetetur sadipscing elitr.')
    cy.contains('CONTINUE').click()

    cy.get('#address-type-selection').should('not.exist')
    cy.get('#street-address-1').type('Lorem Ipsum')
    cy.get('#street-address-2').type('Dolor Sit Amet')
    cy.get('#plus-code').type('7Q24PGPW+48')
    cy.get('#longitude').type('10.735312')
    cy.get('#latitude').type('122.545813')
    cy.get('#city').type('Iloilo City')
    cy.get('#state').type('Iloilo')
    cy.get('#zipCode').type('5000')
    cy.get('#countries').select('Philippines')
    cy.get('[type="submit"]').click()

    cy.fixture('listing-01.jpg').then(image => {
      const cypressImg = { fileName: `listing-01.jpg`, fileContent: image, mimeType: 'image/jpg' }
      cy.get('#image-upload').upload(cypressImg, { subjectType: 'input' })
    })
    cy.fixture('listing-02.jpg').then(image => {
      const cypressImg = { fileName: `listing-02.jpg`, fileContent: image, mimeType: 'image/jpg' }
      cy.get('#file-upload').upload(cypressImg, { subjectType: 'input' })
    })
    cy.fixture('listing-03.jpg').then(image => {
      const cypressImg = { fileName: `listing-03.jpg`, fileContent: image, mimeType: 'image/jpg' }
      cy.get('#file-upload').upload(cypressImg, { subjectType: 'input' })
    })

    cy.get('#media-0').should('exist')
    cy.get('#media-1').should('exist')
    cy.get('#media-2')
      .should('exist')
      .click()

    cy.wait(1000)
    cy.get('#media-delete').click()

    cy.get('#media-0').should('exist')
    cy.get('#media-1').should('exist')
    cy.get('#media-2').should('not.exist')
    cy.contains('CONTINUE').click()

    cy.get('#tags').type('lorem{enter}ipsum{enter}')
    cy.contains('CONTINUE').click()

    cy.get('#selected-moderators')
      .children()
      .should('have.length', 0)
    cy.get('#moderator-search').click()
    cy.get('#moderator-QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK').should('exist')
    cy.get('#moderator-info').should('have.class', 'uk-flex-top uk-modal')
    cy.get('#moderator-info-QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK').click()
    cy.get('#moderator-info').should('have.class', 'uk-flex-top uk-modal uk-flex uk-open')
    cy.get('#moderator-info-close').click()
    cy.get('#moderator-add-QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK').click()
    cy.get('#moderator-QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK').should('not.exist')
    cy.get('#moderator-search').click()
    cy.get('#selected-moderators')
      .children()
      .should('have.length', 1)
    cy.get('#moderator-remove-QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK').click()
    cy.get('#selected-moderators')
      .children()
      .should('have.length', 0)
    cy.get('#moderator-search').type('QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK')
    cy.get('#moderator-QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK').should('exist')
    cy.get('#moderator-add-QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK').click()
    cy.get('#moderator-search').click()
    cy.contains('CONTINUE').click()

    cy.get('#terms-and-conditions-textarea').type(
      'At vero eos et accusam et justo duo dolores et ea rebum.'
    )
    cy.contains('CONTINUE').click()

    cy.get('#coupon-add').click()
    cy.get('#coupon-title-0').type('lorem')
    cy.get('#coupon-code-0').type('ipsum')
    cy.get('#selector-input-coupon-0').type('50')
    cy.get('#coupon-add').click()

    cy.get('#coupon-title-1').type('dolor')
    cy.get('#coupon-code-1').type('sit')
    cy.get('#selector-input-coupon-1').type('1')
    cy.get('#selector-coupon-1').select('Price')
    cy.get('#coupon-remove-0').click()
    cy.get('#coupon-title-1').should('not.exist')
    cy.contains('CONTINUE').click()

    cy.get('#crypto-0').click()
    cy.get('#crypto-1').click()
    cy.get('#crypto-2').click()
    cy.get('#crypto-3').click()
    cy.contains('ADD LISTING').click()

    const x = {
      isOwner: false,
      item: {
        title: 'The Accountant',
        description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        processingTime: '1 day',
        price: 1500,
        tags: ['lorem', 'ipsum'],
        images: [
          {
            filename: 'image.png',
            large: 'QmYW7t7iioLxzMFxxUrFrLbvYGno2ZXBFXKg85NSytaXDp',
            medium: 'QmRCraQ1XKnvhNXXqtBhphc5cbn8PMxmeaNK9WYc5fs2RX',
            original: 'QmSYYRZS5veRXQqY2y4ekDrKyEVgz9nCDKaW1krrYvtGC3',
            small: 'QmXT2PgXsC4XymEGZP9iFcX9FKKQZMQW5wiP7hxCvdZHxG',
            tiny: 'QmZgAEvnzhPTqPheojV7azwVo9uemfnZzFP5AdvVzGFdZU',
          },
          {
            filename: 'image.png',
            large: 'QmYW7t7iioLxzMFxxUrFrLbvYGno2ZXBFXKg85NSytaXDp',
            medium: 'QmRCraQ1XKnvhNXXqtBhphc5cbn8PMxmeaNK9WYc5fs2RX',
            original: 'QmSYYRZS5veRXQqY2y4ekDrKyEVgz9nCDKaW1krrYvtGC3',
            small: 'QmXT2PgXsC4XymEGZP9iFcX9FKKQZMQW5wiP7hxCvdZHxG',
            tiny: 'QmZgAEvnzhPTqPheojV7azwVo9uemfnZzFP5AdvVzGFdZU',
          },
        ],
        categories: ['2411-24'],
        grams: 0,
        condition: 'New',
        options: [],
        skus: [{ quantity: -1 }],
      },
      averageRating: 0,
      hash: '',
      location: {
        addressOne: 'Lorem Ipsum',
        addressTwo: 'Dolor Sit Amet',
        city: 'Iloilo City',
        country: 'PH',
        latitude: '122.545813',
        longitude: '10.735312',
        plusCode: '7Q24PGPW+48',
        state: 'Iloilo',
        zipCode: '5000',
      },
      parentPeer: '',
      peerSlug: '',
      price: { amount: 0, currencyCode: '', modifier: 0 },
      ratingCount: 0,
      thumbnail: { medium: '', small: '', tiny: '' },
      nsfw: false,
      signature: '',
      slug: '',
      currentSlug: '',
      vendorID: { peerID: '', handle: '', pubkeys: { identity: '', bitcoin: '' }, bitcoinSig: '' },
      metadata: {
        version: 0,
        contractType: 'SERVICE',
        format: 'FIXED_PRICE',
        expiry: '2019-09-30T10:24:52.062Z',
        acceptedCurrencies: ['TBTC', 'TLTC', 'TZEC', 'TBCH'],
        pricingCurrency: 'USD',
        language: '',
        escrowTimeoutHours: 0,
        coinType: '',
        coinDivisibility: 100000000,
        priceModifier: 0,
        serviceRateMethod: 'PER_HOUR',
        serviceClassification: '2411-24',
      },
      shippingOptions: [],
      coupons: [
        {
          title: 'dolor',
          discountCode: 'sit',
          type: 'price',
          uniqueId: '0.7845509187621316',
          priceDiscount: 1,
        },
      ],
      moderators: ['QmW7yRaQMQQTe1gvC1SWMzRLDnaN3wUve6aYrYsqMB42FK'],
      termsAndConditions: 'At vero eos et accusam et justo duo dolores et ea rebum.',
      refundPolicy: '',
    }

    cy.wait('@newListing').then((xhr) => {
      const body = xhr.requestBody
      body.metadata.expiry = x.metadata.expiry
      body.coupons = x.coupons
      cy.wrap(JSON.stringify(body)).should('equal', JSON.stringify(x))
    })
  })
})
