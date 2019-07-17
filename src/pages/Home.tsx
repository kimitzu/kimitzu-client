import axios from 'axios'
import React, { Component } from 'react'

import ListingCardGroup from '../components/CardGroup/ListingCardGroup'
import { ChatBox } from '../components/ChatBox'
import { InlineMultiDropdowns } from '../components/Dropdown'
import NavBar from '../components/NavBar/NavBar'
import { FormSelector } from '../components/Selector'
import SidebarFilter from '../components/Sidebar/Filter'
import ServiceCategories from '../constants/ServiceCategories.json'
import SortOptions from '../constants/SortOptions.json'
import Search from '../models/Search'
import ImageUploaderInstance from '../utils/ImageUploaderInstance'
import NestedJsonUpdater from '../utils/NestedJSONUpdater'

import config from '../config'
import './Home.css'

const location = config.openBazaarHost
const ws = new WebSocket(config.websocketHost)

interface HomeProps {
  props: any
}

interface Transform {
  operation: string
  spec: Spec
}

interface Spec {
  hash: string
  thumbnail: string
  'item.title': string
  'item.price': string
  'metadata.pricingCurrency': string
  averageRating: string
}

interface HomeState {
  [x: string]: any
  search: Search
}

class Home extends Component<HomeProps, HomeState> {
  private preventInput: boolean
  constructor(props: any) {
    super(props)
    const search = new Search()

    this.state = {
      search,
      conversations: [],
      indexPeerID: [],
      scrollBottom: true,
      chatMsg: '',
      currID: '',
      disabled: false,
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleSortChange = this.handleSortChange.bind(this)
    this.handlePaginate = this.handlePaginate.bind(this)
    this.handleFilterReset = this.handleFilterReset.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSettings = this.handleSettings.bind(this)
    this.handleSettings = this.handleSettings.bind(this)
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.handleChatMsg = this.handleChatMsg.bind(this)
    this.handleRecipientChange = this.handleRecipientChange.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)
    this.sendMsg = this.sendMsg.bind(this)
    this.preventInput = false
  }

  public async componentDidMount() {
    await this.handleSearchSubmit()
    ws.onopen = evt => {
      console.log('Websocket connected')
    }

    ws.onmessage = data => {
      const d = JSON.parse(data.data)
      if (d.message) {
        const newMsg = d.message
        const index = this.state.indexPeerID.indexOf(d.message.peerId)
        const msg = d.message.message
        const conv = this.state.conversations
        conv[index].messages.push(newMsg)
        this.setState({ conversations: conv, scrollBottom: true })
      }
    }
  }

  public async componentWillMount() {
    const conv = await axios.get(`${location}/ob/chatconversations`)
    const c = conv.data
    if (c.length !== 0) {
      c.map(async (cc, i) => {
        const indexPeerIDTemp = this.state.indexPeerID
        indexPeerIDTemp.push(cc.peerId)
        this.setState({ indexPeerID: indexPeerIDTemp })
        const prof = await axios.get(`${config.djaliHost}/djali/peer/get?id=${cc.peerId}`)
        if (prof && prof.data.profile) {
          if (prof.data.profile.avatarHashes) {
            c[i].image = `${location}/ob/images/${prof.data.profile.avatarHashes.small}`
          } else {
            c[i].image = './images/user.png'
          }
          c[i].name = prof.data.profile.name
          const message = await axios.get(
            `${location}/ob/chatmessages/${cc.peerId}?limit=20&offsetId=&subject=`
          )
          if (message) {
            c[i].messages = message.data.reverse()
          } else {
            c[i].messages = []
          }
        }
      })
    }
    this.setState({ conversations: c })
  }

  public handleChatMsg(value) {
    if (this.preventInput) {
      this.preventInput = false
      return
    }
    this.setState({ chatMsg: value })
  }

  public handleRecipientChange(value) {
    this.setState({ currID: value })
  }

  public async sendMsg() {
    const chatmsgTemp = this.state.chatMsg
    const msg = {
      message: this.state.chatMsg,
      messageId: '',
      outgoing: true,
      peerId: this.state.currID,
      read: true,
      subject: '',
      timestamp: new Date(),
    }

    const index = this.state.indexPeerID.indexOf(this.state.currID)

    const conv = this.state.conversations
    if (this.state.chatMsg !== '') {
      conv[index].messages.push(msg)
    }
    this.setState({ disabled: true, chatMsg: '' })
    this.setState({ conversations: conv, scrollBottom: true })

    const res = await axios.post(`${location}/ob/chat`, {
      subject: '',
      message: chatmsgTemp,
      peerId: this.state.currID,
    })
    if (res) {
      this.setState({ chatMsg: '', disabled: false })
      const el = document.getElementById('chat-input')
      if (el) {
        el.focus()
      }
    }
  }

  public async onKeyPress(event) {
    const code = event.keyCode || event.which
    if (code === 13 && !event.shiftKey) {
      this.preventInput = true
      await this.sendMsg()
    }
  }

  public renderPages(): JSX.Element[] {
    const pages: JSX.Element[] = []
    let startIndex = 0
    let paginationLimit = 9

    if (this.state.search.paginate.currentPage < 5) {
      startIndex = 0
      paginationLimit = 9
    } else {
      startIndex = this.state.search.paginate.currentPage - 4
      paginationLimit = this.state.search.paginate.currentPage + 5
    }

    if (paginationLimit > this.state.search.paginate.totalPages) {
      paginationLimit = this.state.search.paginate.totalPages
    }

    for (let index = startIndex; index < paginationLimit; index++) {
      let isActive = false

      if (this.state.search.paginate.currentPage === index) {
        isActive = true
      }

      pages.push(
        <li key={index}>
          <a
            href="#"
            className={isActive ? 'uk-badge' : ''}
            onClick={async () => await this.handlePaginate(index)}
          >
            {index + 1}
          </a>
        </li>
      )
    }

    return pages
  }

  public render() {
    return (
      <div>
        <NavBar
          handleSettings={this.handleSettings}
          onQueryChange={this.handleChange}
          onSearchSubmit={this.handleSearchSubmit}
          isSearchBarShow
        />
        <div className="main-container">
          <ChatBox
            convos={this.state.conversations}
            scrollBottom={this.state.scrollBottom}
            chatBoxOnchange={this.handleChatMsg}
            onRecipientChange={this.handleRecipientChange}
            onKeyPress={this.onKeyPress}
            chatValue={this.state.chatMsg}
            disabled={this.state.disabled}
            sendMsg={this.sendMsg}
          />
          <div className="child-main-container">
            <div className="custom-width">
              <InlineMultiDropdowns
                title="Classification"
                handleItemSelect={this.handleDropdownSelect}
                items={ServiceCategories}
              />
              <SidebarFilter
                locationRadius={this.state.search.locationRadius}
                onChange={this.handleChange}
                onFilterChange={this.handleFilterChange}
                onFilterSubmit={this.handleSearchSubmit}
                plusCode={this.state.search.plusCode}
                onFilterReset={this.handleFilterReset}
              />
            </div>
            {this.state.search.results.count > 0 ? (
              <div className="custom-width-two">
                <div className="pagination-cont">
                  <div className="left-side-container">
                    {this.state.search.results.count > 25 ? (
                      <ul className="uk-pagination">
                        <li>
                          <a
                            href="#"
                            onClick={() =>
                              this.handlePaginate(this.state.search.paginate.currentPage - 1)
                            }
                          >
                            <span uk-icon="icon: chevron-left" />
                          </a>
                        </li>
                        {this.renderPages()}
                        <li>
                          <a
                            href="#"
                            onClick={() =>
                              this.handlePaginate(this.state.search.paginate.currentPage + 1)
                            }
                          >
                            <span uk-icon="icon: chevron-right" />
                          </a>
                        </li>
                      </ul>
                    ) : null}
                    <div className="uk-expand uk-margin-left margin-custom">
                      <FormSelector
                        options={SortOptions}
                        defaultVal={this.state.search.sort}
                        onChange={event => this.handleSortChange(event.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <ListingCardGroup data={this.state.search.results.data} />
                  </div>
                </div>
              </div>
            ) : this.state.search.isSearching ? (
              <div className="uk-align-center">
                <div data-uk-spinner="ratio: 3" />
              </div>
            ) : (
              <div className="uk-align-center">
                <h2>No Results ¯\_(ツ)_/¯</h2>
                <p>Try a different search keyword or filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  private async handleSearchSubmit() {
    const { search } = this.state
    search.isSearching = true
    this.setState({
      search,
    })

    const newSearch = await this.state.search.execute()
    search.isSearching = false
    this.setState({
      search: newSearch,
    })
  }

  private async handleChange(field: string, value: any, parentField?: string): Promise<any> {
    if (field === 'avatar') {
      const base64ImageStr = await ImageUploaderInstance.convertToBase64(value[0])
      value = base64ImageStr
    }

    if (parentField) {
      const subFieldData = this.state[parentField]
      NestedJsonUpdater(subFieldData, field, value)
      this.setState({ subFieldData })
    } else {
      this.setState({
        [field]: value,
      })
    }
  }

  private handleFilterChange(field: string, value: string, modifier?: string) {
    const { filters, modifiers } = this.state.search
    filters[field] = value
    modifiers[field] = modifier ? modifier : '=='

    if (!filters[field]) {
      delete filters[field]
      delete modifiers[field]
    }

    this.setState({
      search: this.state.search,
    })
  }

  private async handlePaginate(index: number) {
    const search = await this.state.search.executePaginate(index)
    if (search) {
      this.setState({
        search,
      })
    }
  }

  private async handleFilterReset() {
    this.state.search.reset()
    const search = await this.state.search.execute()
    this.setState({
      search,
    })
  }

  private async handleSortChange(sortParams: string) {
    const search = await this.state.search.executeSort(sortParams)
    this.setState({
      search,
    })
  }

  private handleSettings() {
    window.location.href = '/settings/profile'
  }

  private async handleDropdownSelect(selectedItem) {
    this.handleFilterChange('item.categories', selectedItem)
    await this.handleSearchSubmit()
  }
}

export default Home
