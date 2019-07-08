const oldTime = new Date().getTime()

const fs = require('fs')

const file = fs.readFileSync('./document.txt')
const allJobs = file.toString()
const all = allJobs.split('\n')

const jobSplit = []

for (let index = 0; index < all.length; index++) {
  const job = all[index];
  const x = job.match(/\d+/)
  const num = x[0]
  const jb = job.replace(`${num} `, '')

  if (num.toString().length === 1) {
    const obj = {
      id: num,
      title: jb,
      tags: [],
      children: []
    }
    jobSplit.push(obj)
  }
}

let currentIndex = 1
let currentSubIndex = 1
let currentFinalIndex = 1

for (let index = 0; index < all.length; index++) {
  const job = all[index];
  const x = job.match(/\d+/)
  const num = x[0]
  const jb = job.replace(`${num} `, '')

  currentIndex = num.toString()[0]
  
  if (num.toString().length === 2) {
    const obj = {
      id: num,
      title: jb,
      tags: [],
      children: []
    }
    jobSplit[currentIndex].children.push(obj)
  }

  currentSubIndex = num.toString()[1]

  if (num.toString().length === 3) {
    const obj = {
      id: num,
      title: jb,
      tags: [],
      children: []
    }
    jobSplit[currentIndex].children[currentSubIndex - 1].children.push(obj)
  }

  currentFinalIndex = num.toString()[2]

  if (num.toString().length === 4) {
    const obj = {
      id: num,
      title: jb,
      tags: [],
    }
    jobSplit[currentIndex].children[currentSubIndex - 1].children[currentFinalIndex - 1].children.push(obj)
  }
}

const fileDesc = fs.readFileSync('./document_desc.txt')
const allJobsDesc = fileDesc.toString().replace(/, /g, ' > ')
const parsedAllJobsDesc = allJobsDesc.split('\n')

for (let index = 0; index < parsedAllJobsDesc.length; index++) {
  let [id, element] = parsedAllJobsDesc[index].split(',');
  element = element.replace(/"/g, '')
  element = element.replace(/:/g, '')
  element = element.replace(/>/g, ':')
  
  const shifter = element.split(':')

  if (shifter.length > 1) {
    const el = shifter.shift()
    element = `${shifter[0].trim()} ${el.trim()}`
  }

  element = element.trim()

  const temp = element.split(' ')
  
  if (temp) {
    element = temp.map((el) => {
      if (!el[0]) {
        return el
      }
      el = el[0].toUpperCase() + el.substr(1)
      return el
    }).join(' ')
  }

  id = id.toString()
  const level1 = `${id[0]}`
  const level2 = `${id[0]}${id[1]}`
  const level3 = id[2] ? `${id[0]}${id[1]}${id[2]}` : undefined
  const level4 = id[3] ? `${id[0]}${id[1]}${id[2]}${id[3]}` : undefined

  const levelObj1 = jobSplit.find((value) => {
    return value.id === level1
  })

  const levelObj2 = levelObj1.children.find((value) => {
    return value.id === level2
  })

  if (!level3) {
    levelObj2.tags.push(element)
    continue
  }

  const levelObj3 = levelObj2.children.find((value) => {
    return value.id === level3
  })

  if (!level4) {
    levelObj3.tags.push(element)
    continue
  }

  const levelObj4 = levelObj3.children.find((value) => {
    return value.id === level4
  })

  levelObj4.tags.push(element)
}

fs.writeFileSync('ServiceTypes.json', JSON.stringify(jobSplit))

const newTime = new Date().getTime()

console.log(`Parsing done in ${newTime - oldTime} ms!`)