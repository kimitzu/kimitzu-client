const fs = require('fs')

const file = fs.readFileSync('./temp.txt')
const allJobs = file.toString()
const all = allJobs.split('\n')

const jobSplit = []

all.forEach((job) => {
  const x = job.match(/\d+/)
  const num = x[0]
  const jb = job.replace(`${num} `, '')
  const obj = {
    id: num,
    title: jb,
  }
  jobSplit.push(obj)
})

fs.writeFileSync('ServiceTypes.json', JSON.stringify(jobSplit))