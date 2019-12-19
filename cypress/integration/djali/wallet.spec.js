/// <reference types="Cypress" />
/* global context, cy, Cypress */

context('Wallet', () => {
  beforeEach(() => {
    cy.server({})

    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/config',
      response: {}
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peers',
      response: {},
    })

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
      method: 'GET',
      url: 'http://localhost:4002/wallet/balance',
      response: 'fixture:wallet/balance.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/chatconversations',
      response: []
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/wallet/address',
      response: 'fixture:wallet/addresses.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/wallet/transactions/tbtc',
      response: 'fixture:wallet/BitcoinTxs.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/wallet/transactions/tltc',
      response: 'fixture:wallet/LitecoinTxs.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/wallet/transactions/tzec',
      response: 'fixture:wallet/ZcashTxs.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/wallet/transactions/tbch',
      response: 'fixture:wallet/BitcoinCashTxs.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/exchangerate/TBTC/USD',
      response: 2
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/exchangerate/TLTC/USD',
      response: 4
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/exchangerate/TZEC/USD',
      response: 6
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:4002/ob/exchangerate/TBCH/USD',
      response: 8
    })
    cy.route({
      method: 'GET',
      url: ' http://localhost:4002/ob/settings',
      response: 'fixture:settings/primary.json',
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:4002/wallet/spend',
      response: {}
    }).as('spend')
    cy.visit('http://localhost:3000/#/wallet')
  })

  function validateCryptocurrencyValues(cryptoCurr, expectedValue, exchangeRate, txNum = 4) {
    cy.get('.selected > .crypto-content > .crypto-balance')
      .contains(`${expectedValue}.0000 ${cryptoCurr.toLowerCase()}`)
    cy.get('#left-cont-bal > .value-bal')
      .contains(`${expectedValue} ${cryptoCurr}`)
    cy.get('#middle-cont-bal > .value-bal')
      .contains(`${expectedValue * exchangeRate} USD`)
    cy.get('#right-cont-bal')
      .contains(txNum)

    cy.get(':nth-child(1) > .uk-input')
      .type('SampleAddressToSendInBitcoin')
    cy.get('#selector-input')
      .clear()
      .type('100')
    cy.get(':nth-child(3) > .uk-input')
      .type('SampleNoteToSend')

    cy.get('#kimitzu-btn')
      .click()

    cy.wait('@spend').then((xhr) => {
      expect(xhr.requestBody.address).to.equal("SampleAddressToSendInBitcoin")
      expect(xhr.requestBody.amount).to.equal(10000000000)
      expect(xhr.requestBody.feeLevel).to.equal("NORMAL")
      expect(xhr.requestBody.memo).to.equal("SampleNoteToSend")
      expect(xhr.requestBody.spendAll).to.equal(false)
      expect(xhr.requestBody.wallet).to.equal(cryptoCurr)
    })

    cy.get(':nth-child(2) > .bold-nav')
      .click()
    cy.get('.uk-text-bold')
      .contains(`expected${cryptoCurr}Address`)

    for (let i=1; i<=txNum; i++)
    {
      cy.get(`:nth-child(${i})`)
        .contains(`${i % 2 ? '' : '-' }0.00000123 ${cryptoCurr}`)
      cy.get(`:nth-child(${i})`)
        .contains(`${i % 2 ? 'RECEIVED' : 'SENT'}`)
      cy.get(`:nth-child(${i})`)
        .contains(`January ${i}, 2019`)
      cy.get(`:nth-child(${i})`)
        .contains(`expected${cryptoCurr}Addr${i}`)
      cy.get(`:nth-child(${i})`)
        .contains(`(${i} confirmations)`)
    }
  }

  it('should display correct BITCOIN wallet values', () => {
    cy.get('#TBTC-desktop')
      .contains('Bitcoin (TBTC)')

    const expectedBalance = 1
    const expectedExchangeRate = 2
    validateCryptocurrencyValues('TBTC', expectedBalance, expectedExchangeRate)
  })

  it('should display correct LITECOIN wallet values', () => {
    cy.get('#TLTC-desktop')
      .click()

    cy.get('#TLTC-desktop')
      .contains('Litecoin (TLTC)')

    const expectedBalance = 2
    const expectedExchangeRate = 4
    validateCryptocurrencyValues('TLTC', expectedBalance, expectedExchangeRate)
  })

  it('should display correct ZCASH wallet values', () => {
    cy.get('#TZEC-desktop')
      .click()

    cy.get('#TZEC-desktop')
      .contains('ZCash (TZEC)')

    const expectedBalance = 3
    const expectedExchangeRate = 6
    validateCryptocurrencyValues('TZEC', expectedBalance, expectedExchangeRate)
  })

  it('should display correct BITCOIN CASH wallet values', () => {
    cy.get('#TBCH-desktop')
      .click()
    cy.get('#TBCH-desktop')
      .contains('Bitcoin Cash (TBCH)')

    const expectedBalance = 4
    const expectedExchangeRate = 8
    validateCryptocurrencyValues('TBCH', expectedBalance, expectedExchangeRate)
  })
})