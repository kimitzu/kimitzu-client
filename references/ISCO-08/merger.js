const fs = require('fs')

const start = new Date()

const categoriesRaw = fs.readFileSync('./document.txt')
const typesRaw = fs.readFileSync('./document_desc.txt')

const serviceTypes = {}

const categories = categoriesRaw.toString().split('\r\n')
const types = typesRaw.toString().split('\r\n')

categories.forEach(categories => {
    const temp = categories.split(' ')
    const ID = temp[0]
    const description = categories.replace(ID, '').trim()
    serviceTypes[`${ID}-0`] = description
})

let lastType = 0
let lastIndex = 1

for (let index = 0; index < types.length; index++) {
    const type = types[index];
    const temp = type.split(',')
    const ID = temp[0]
    
    if (ID !== lastType) {
        lastIndex = 1
    }
    lastType = ID

    const description = type.replace(`${ID},`, '').replace(/"/g, '').trim()
    serviceTypes[`${ID}-${lastIndex}`] = description

    lastIndex += 1
}

fs.writeFileSync('./ServiceTypes.json', JSON.stringify(serviceTypes))

const end = new Date()

console.log(`[${end.getTime() - start.getTime()}ms] Parsing success. ${Object.keys(serviceTypes).length} objects parsed.`)