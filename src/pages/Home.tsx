import { RefresherEventDetail } from '@ionic/core'
import {
  IonContent,
  IonItem,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  isPlatform,
} from '@ionic/react'
import React, { Component } from 'react'

import { ListingCardSkeleton } from '../components/Card'
import ListingCardGroup from '../components/CardGroup/ListingCardGroup'
import { InlineMultiDropdowns } from '../components/Dropdown'
import AdvanceSearchModal from '../components/Modal/AdvanceSearchModal'
import { NavBar } from '../components/NavBar'
import { Pagination } from '../components/Pagination'
import { FormSelector } from '../components/Selector'
import SidebarFilter from '../components/Sidebar/Filter'
import ServiceCategories from '../constants/ServiceCategories.json'
import SortOptions from '../constants/SortOptions.json'

import Profile from '../models/Profile'
import { Search, searchInstance } from '../models/Search'
import ImageUploaderInstance from '../utils/ImageUploaderInstance'
import NestedJsonUpdater from '../utils/NestedJSONUpdater'

import { localeInstance } from '../i18n'

import './Home.css'

interface HomeProps {
  currentUser: Profile
}

interface HomeState {
  [x: string]: any
  search: Search
  rating: number
  profile: Profile
  showAdvancedSearch: boolean
}

class Home extends Component<HomeProps, HomeState> {
  private locale = localeInstance.get.localizations
  private filterSidebarRef = React.createRef<HTMLDivElement>()

  constructor(props: any) {
    super(props)
    const profile = this.props.currentUser

    this.state = {
      search: searchInstance,
      rating: 0,
      profile,
      showAdvancedSearch: false,
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleSortChange = this.handleSortChange.bind(this)
    this.handlePaginate = this.handlePaginate.bind(this)
    this.handleFilterReset = this.handleFilterReset.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.handleRatingChange = this.handleRatingChange.bind(this)
    this.handleFilterDelete = this.handleFilterDelete.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleAdvancedSearchToggle = this.handleAdvancedSearchToggle.bind(this)
  }

  public async componentDidMount() {
    this.state.search.reset()
    await this.handleSearchSubmit()

    const profile = this.props.currentUser
    this.setState({ profile })

    const searchEvent = (event: CustomEvent) => {
      this.handleChange('query', event.detail, 'search')
      this.handleSearchSubmit()
    }
    window.removeEventListener('srchEvent', searchEvent as EventListener)
    window.addEventListener('srchEvent', searchEvent as EventListener)
  }

  public render() {
    if (this.state.showAdvancedSearch) {
      return this.renderAdvancedSearch()
    }
    return this.renderMain()
  }

  public renderAdvancedSearch() {
    return (
      <div className="uk-margin-top">
        <AdvanceSearchModal
          onSearchSubmit={this.handleSearchSubmit}
          onBackNavigate={this.handleAdvancedSearchToggle}
        />
      </div>
    )
  }

  public renderMain() {
    const { profile, rating, search } = this.state
    return (
      <IonPage>
        {isPlatform('mobile') || isPlatform('mobileweb') ? (
          <NavBar profile={profile} isSearchBarShow /> // TODO: make separate navbar for mobile
        ) : null}
        <IonContent>
          {isPlatform('mobile') || isPlatform('mobileweb') ? (
            <IonRefresher slot="fixed" onIonRefresh={this.handleRefresh}>
              <IonRefresherContent />
            </IonRefresher>
          ) : null}
          <div id="filter-sidebar" uk-offcanvas="mode: slide" ref={this.filterSidebarRef}>
            <div className="uk-offcanvas-bar">
              <InlineMultiDropdowns
                title="Browse Classifications"
                handleItemSelect={this.handleDropdownSelect}
                items={ServiceCategories}
                id="mobile"
              />
              <SidebarFilter
                id="sidebar-mobile"
                key={this.state.search.searchID}
                profile={profile}
                locationRadius={search.locationRadius}
                onChange={this.handleChange}
                onFilterChange={this.handleFilterChange}
                onFilterSubmit={this.handleSearchSubmit}
                onRatingChanged={this.handleRatingChange}
                onFilterDelete={this.handleFilterDelete}
                onAdvancedSearchShow={this.handleAdvancedSearchToggle}
                plusCode={search.plusCode}
                onFilterReset={this.handleFilterReset}
                rating={rating}
                searchInstance={this.state.search}
              />
            </div>
          </div>
          <div className="main-container">
            <div className="child-main-container">
              <div className="custom-width uk-visible@s">
                <InlineMultiDropdowns
                  title={this.locale.homePage.headerDropdownPlaceholder}
                  handleItemSelect={this.handleDropdownSelect}
                  items={ServiceCategories}
                  id="desktop"
                />
                <SidebarFilter
                  id="sidebar-desktop"
                  key={this.state.search.searchID}
                  profile={profile}
                  locationRadius={search.locationRadius}
                  onChange={this.handleChange}
                  onFilterChange={this.handleFilterChange}
                  onFilterSubmit={this.handleSearchSubmit}
                  onRatingChanged={this.handleRatingChange}
                  onFilterDelete={this.handleFilterDelete}
                  onAdvancedSearchShow={this.handleAdvancedSearchToggle}
                  plusCode={search.plusCode}
                  onFilterReset={this.handleFilterReset}
                  rating={rating}
                  searchInstance={this.state.search}
                />
              </div>
              <div className="custom-width-two">
                <div className="right-side-container">
                  <div className="uk-hidden@s">
                    <button
                      className="uk-button uk-button-default uk-margin-small-right"
                      type="button"
                      uk-toggle="target: #filter-sidebar"
                    >
                      Filters
                    </button>
                  </div>
                  <Pagination
                    totalRecord={search.results.count}
                    recordsPerPage={search.paginate.limit}
                    handlePageChange={this.handlePaginate}
                    selectedPage={search.paginate.currentPage + 1}
                  />
                  <div className="uk-expand uk-margin-left margin-custom">
                    <FormSelector
                      id="sortOptions"
                      options={SortOptions}
                      defaultVal={search.sortIndicator}
                      onChange={event => this.handleSortChange(event.target.value)}
                    />
                  </div>
                </div>
                {search.results.data && search.results.count > 0 ? (
                  <div className="pagination-cont">
                    <div className="uk-flex uk-flex-center">
                      <ListingCardGroup
                        key={search.paginate.currentPage}
                        data={search.results.data}
                        targetCurrency={profile.preferences.fiat}
                        listingLimit={search.paginate.limit}
                      />
                    </div>
                    <div className="uk-flex uk-flex-center uk-flex-middle uk-margin">
                      <Pagination
                        totalRecord={search.results.count}
                        recordsPerPage={search.paginate.limit}
                        handlePageChange={this.handlePaginate}
                        selectedPage={search.paginate.currentPage + 1}
                      />
                    </div>
                  </div>
                ) : search.isSearching ? (
                  <div className="uk-flex uk-flex-center uk-grid-small" data-uk-grid>
                    {this.generateSkeletonCards(8)}
                  </div>
                ) : search.responseStatus === 204 ? (
                  <div
                    className="uk-align-center full-vh uk-flex uk-flex-column uk-flex-center uk-flex-middle"
                    id="empty-results"
                  >
                    <h1>{this.locale.homePage.crawlingHeader}</h1>
                    <p>{this.locale.homePage.crawlingContent1}</p>

                    <p className="uk-margin-top">{this.locale.homePage.crawlingContent2}</p>
                  </div>
                ) : (
                  <div
                    className="uk-align-center full-vh uk-flex uk-flex-column uk-flex-center uk-flex-middle"
                    id="empty-results"
                  >
                    <h1>{this.locale.homePage.noResultsHeader}</h1>
                    <p>{this.locale.homePage.noResultsContent}</p>

                    <div className="uk-align-center uk-margin-top">
                      <p className="color-secondary">
                        {this.locale.homePage.noResultsSuggestionsText}
                      </p>

                      <ul className="uk-margin-left">
                        {this.locale.homePage.noResultsSuggestions.map(
                          (suggestion: string, index: number) => (
                            <li key={`${suggestion}${index}`}>{suggestion}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    )
  }

  private generateSkeletonCards(count: number) {
    const content: JSX.Element[] = []
    for (let i = 0; i < count; i++) {
      content.push(
        <IonItem lines="none" key={`placeholder-card-${i}`}>
          <ListingCardSkeleton key={`skeleton${i}`} />
        </IonItem>
      )
    }
    return content
  }

  private async handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    await this.handleSearchSubmit()
    event.detail.complete()
  }

  private handleAdvancedSearchToggle() {
    this.setState({
      showAdvancedSearch: !this.state.showAdvancedSearch,
    })
  }

  private async handleSearchSubmit() {
    const { search } = this.state

    if (this.state.showAdvancedSearch) {
      this.setState({
        showAdvancedSearch: false,
      })
    }

    if (this.filterSidebarRef.current) {
      window.UIkit.offcanvas(this.filterSidebarRef.current).hide()
    }

    if (!search.query.includes(' ') && search.query.length === 46) {
      window.location.hash = `/profile/${search.query}`
      return
    }

    search.isSearching = true
    this.setState({
      search,
    })

    const newSearch = await search.execute()
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

  private handleRatingChange(nextValue: number, prevValue: number, name: string) {
    let rating = 0

    if (nextValue === prevValue) {
      rating = 0
    } else {
      rating = nextValue
    }

    this.setState({ rating })

    switch (rating) {
      case 0:
        const { filters, modifiers } = this.state.search
        delete filters.averageRating
        delete modifiers.averageRating
        this.setState({
          search: this.state.search,
        })
        break
      case 1:
        this.handleFilterChange('averageRating', '1', '>=')
        break
      case 2:
        this.handleFilterChange('averageRating', '2', '>=')
        break
      case 3:
        this.handleFilterChange('averageRating', '3', '>=')
        break
      case 4:
        this.handleFilterChange('averageRating', '4', '>=')
        break
      case 5:
        this.handleFilterChange('averageRating', '5', '>=')
        break
    }
  }

  private handleFilterChange(field: string, value: string, modifier?: string) {
    const { filters, modifiers } = this.state.search

    filters[field] = value
    modifiers[field] = modifier ? modifier : '=='

    this.setState({
      search: this.state.search,
    })
  }

  private handleFilterDelete(field) {
    const { filters, modifiers } = this.state.search
    delete filters[field]
    delete modifiers[field]
    this.setState({
      search: this.state.search,
    })
  }

  private async handlePaginate(index: number) {
    window.scrollTo(0, 0)
    const search = await this.state.search.executePaginate(index - 1)
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
      rating: 0,
    })
  }

  private async handleSortChange(sortParams: string) {
    const search = await this.state.search.executeSort(sortParams)
    this.setState({
      search,
    })
  }

  private async handleDropdownSelect(itemValue, itemId) {
    this.state.search.query = itemValue
    await this.handleSearchSubmit()
  }
}

export default Home
