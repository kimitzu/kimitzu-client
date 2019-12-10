export interface State {
  breadState: string[]
  breadHistory: BreadHistory[]
}

export interface BreadHistory {
  link: string
  name: string
}

class BreadCrumb implements State {
  public breadState: string[] = ['Home']
  public breadHistory: BreadHistory[] = [
    {
      link: '/',
      name: 'Home',
    },
  ]
  public breadCrumbRecordHistory() {
    const url = window.location
    const indexHashtag = url.toString().indexOf('#')
    let newUrl = url.toString().substr(indexHashtag + 2)
    const currPage = newUrl.replace('/', ' ')

    let breadState = this.breadState
    let breadHistory = this.breadHistory
    if (newUrl === '') {
      newUrl = 'Home'
    }
    if (breadState.indexOf(newUrl) === -1) {
      let crumbName
      const pastValue = breadHistory[breadState.length - 1].name
      if (currPage.length > 20) {
        breadState.push(currPage.replace(' ', '/'))
        crumbName = currPage
          .replace(pastValue + ' ', '')
          .replace(/\//g, ' ')
          .replace(/ .*/g, '')
      } else {
        breadState.push(currPage.replace(' ', '/'))
        crumbName = currPage
      }

      breadHistory.push({
        link: currPage.replace(' ', '/'),
        name: crumbName,
      })
    } else {
      let index
      if (newUrl === 'Home') {
        index = 1
      } else {
        index = breadState.indexOf(newUrl) + 1
      }
      breadState = breadState.slice(0, index)
      breadHistory = breadHistory.slice(0, index)
    }
    this.breadHistory = breadHistory
    this.breadState = breadState
    return this
  }
}

const breadCrumbInstance = new BreadCrumb()
export { breadCrumbInstance, BreadCrumb }
