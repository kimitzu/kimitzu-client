import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'

import { Button } from '../components/Button'
import OrderItemCard from '../components/Card/OrderItemCard'

import OrderHistory from '../models/OrderHistory'
import './History.css'

interface HistoryState {
  orders: OrderHistory[]
  filteredOrders: OrderHistory[]
  filters: string[]
  isLoading: boolean
  viewType: string
  query: string
}

interface RouteProps {
  view: string
}

interface HistoryProps extends RouteComponentProps<RouteProps> {}

class History extends React.Component<HistoryProps, HistoryState> {
  constructor(props) {
    super(props)
    this.state = {
      viewType: '',
      orders: [],
      filteredOrders: [],
      filters: [],
      isLoading: true,
      query: '',
    }
    this.renderFilters = this.renderFilters.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleResetFilter = this.handleResetFilter.bind(this)
  }

  public async componentDidMount() {
    let orders: OrderHistory[] = []
    const viewType = this.props.match.params.view

    switch (viewType) {
      case 'purchases': {
        orders = await OrderHistory.getPurchases()
        break
      }
      case 'sales': {
        orders = await OrderHistory.getSales()
        break
      }
      case 'cases': {
        orders = await OrderHistory.getCases()
        break
      }
      default:
        // TODO: Refactor to a Not Found page
        throw new Error('Page not found')
    }

    this.setState({
      orders,
      filteredOrders: orders,
      isLoading: false,
      viewType: viewType.toUpperCase(),
    })
  }

  public render() {
    return (
      <div
        id="purchase-history"
        className="uk-card uk-card-default uk-card-body uk-width-5-6@m uk-flex uk-margin-auto"
      >
        <div id="side-menu-filters" className="uk-card-default">
          <h4 id="side-menu-filters-title" className="color-primary">
            FILTERS
          </h4>
          <form className="uk-margin-top">
            {this.renderFilters()}
            <Button
              className="uk-button uk-button-link"
              type="reset"
              onClick={this.handleResetFilter}
            >
              Reset Filters
            </Button>
          </form>
        </div>
        <div id="side-menu-purchases">
          <div id="side-menu-purchases-header">
            <div hidden id="left">
              <span className="uk-margin-medium-left" uk-icon="arrow-left" />
            </div>
            <div id="center">
              <h4 id="side-menu-purchases-title" className="color-primary">
                {this.state.viewType}
              </h4>
            </div>
            <div hidden id="right">
              <span className="uk-margin-medium-right" uk-icon="close" />
            </div>
          </div>
          <div className="uk-margin">
            <form
              className="uk-search uk-search-default uk-width-3-4"
              onSubmit={evt => {
                evt.preventDefault()
                this.handleFilterChange('query', this.state.query)
              }}
            >
              <span
                className="uk-search-icon-flip color-primary"
                data-uk-search-icon
                data-uk-icon="icon: search"
              />
              <input
                id="purchase-search-text"
                className="uk-search-input"
                type="search"
                placeholder="Search by title, order #, or vendor"
                onChange={evt => {
                  this.setState({
                    query: evt.target.value,
                  })
                }}
              />
            </form>
          </div>
          <p id="number-purchases-text">
            {' '}
            {this.state.filteredOrders.length || 0} {this.state.viewType.toLowerCase()} found{' '}
          </p>
          {this.state.isLoading ? (
            <div uk-spinner="ratio: 2" />
          ) : this.state.filteredOrders.length > 0 ? (
            this.state.filteredOrders.map(order => (
              <Link
                to={`${window.location.hash.substr(1)}/${order.orderId || order.caseId}`}
                key={order.orderId || order.caseId}
                className="no-underline-on-link"
              >
                <OrderItemCard data={order} />
              </Link>
            ))
          ) : (
            <div>No {this.state.viewType.toLowerCase()}.</div>
          )}
        </div>
      </div>
    )
  }

  private renderFilters() {
    const { filters } = OrderHistory
    return Object.keys(filters).map(filterKey => (
      <div key={filterKey} className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
        <label className="uk-text-capitalize">
          <input
            className="uk-checkbox"
            type="checkbox"
            onChange={e => this.handleFilterChange(filterKey, e.target.checked)}
          />
          <a data-uk-tooltip={filters[filterKey].description}> {filterKey}</a>
        </label>
      </div>
    ))
  }

  /**
   * Handles filter change event.
   *
   * Filtering priority:
   * 1. Filter by query
   * 2. Filter by order status
   *
   * @param selectedFilter - Filter name
   * @param value - Value of the filter
   */
  private handleFilterChange(selectedFilter, value) {
    const orderFilters = OrderHistory.filters
    const { filters } = this.state

    /**
     * Filter the orders by query.
     */
    let orders = [...this.state.orders]
    orders = orders.filter(order => {
      const regExpTitle = new RegExp(`${this.state.query}`, 'i')
      return regExpTitle.test(order.title)
    })

    if (value && selectedFilter !== 'query') {
      filters.push(selectedFilter)
    } else {
      const index = filters.findIndex(filter => filter === selectedFilter)
      if (index !== -1) {
        filters.splice(index, 1)
      }
    }

    this.setState(state => {
      /**
       * Revert results to original order list.
       */
      if (filters.length === 0 && !state.query) {
        return {
          filters,
          filteredOrders: state.orders,
        }
      }

      /**
       * No order status filters, filter by query.
       */
      if (filters.length === 0 && state.query) {
        return {
          filters,
          filteredOrders: orders,
        }
      }

      /**
       * Filter by order status.
       */
      const filteredStates: string[] = filters.reduce((acc: string[], cur: string) => {
        const newFilters = [...acc, ...orderFilters[cur].states]
        return newFilters
      }, [])

      const filteredOrders = orders.filter(order => filteredStates.includes(order.state))

      return {
        filters,
        filteredOrders,
      }
    })
  }

  private handleResetFilter() {
    this.setState(state => ({
      filters: [],
      filteredOrders: state.orders,
    }))
  }
}

export default History
