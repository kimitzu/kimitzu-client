const ServiceTypes = require('./ServiceTypes.json')
const fs = require('fs')

const keys = Object.keys(ServiceTypes)

const correctedServiceTypes = {}
keys.forEach(key => {
  const element = ServiceTypes[key].toString().replace(/\s+/g, ' ')
  const elementSplit = capitalize(element)
  correctedServiceTypes[key] = elementSplit
})

function capitalize(words) {
  const wordsArray = words.trim().split(' ')
  return wordsArray
    .map(word => {
      if (['and', 'or', 'to', 'in', 'of', 'the', 'for', 'as', 'a'].includes(word.toLowerCase())) {
        return word
      }

      if (word[0] === '(') {
        return '(' + word[1].toUpperCase() + word.substr(2)
      } else {
        return word[0].toUpperCase() + word.substr(1)
      }
    })
    .join(' ')
}

fs.writeFileSync('./ServiceTypes_Corrected.json', JSON.stringify(correctedServiceTypes))
console.log('Corrections Written.')