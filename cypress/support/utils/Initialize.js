const Initialize = (cy) => {
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
        url: 'http://localhost:8109/info/version',
        response: 'fixture:version.json',
    })
}

export default Initialize