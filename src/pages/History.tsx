import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'

import OrderItemCard from '../components/Card/OrderItemCard'

import OrderHistory from '../models/OrderHistory'
import './History.css'

interface HistoryState {
  orders: OrderHistory[]
  isLoading: boolean
  viewType: string
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
      isLoading: true,
    }
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
      default:
        throw new Error('Page not found')
    }

    this.setState({
      orders,
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
          <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            <label>
              <input className="uk-checkbox" type="checkbox" /> Unfunded
            </label>
          </div>
          <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            <label>
              <input className="uk-checkbox" type="checkbox" /> Refunded
            </label>
          </div>
          <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            <label>
              <input className="uk-checkbox" type="checkbox" /> Pending
            </label>
          </div>
          <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            <label>
              <input className="uk-checkbox" type="checkbox" /> Disputes
            </label>
          </div>
          <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            <label>
              <input className="uk-checkbox" type="checkbox" /> Ready To Process
            </label>
          </div>
          <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            <label>
              <input className="uk-checkbox" type="checkbox" /> Completed
            </label>
          </div>
          <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            <label>
              <input className="uk-checkbox" type="checkbox" /> Fulfilled
            </label>
          </div>
          <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            <label>
              <input className="uk-checkbox" type="checkbox" /> Errors
            </label>
          </div>
          <a href="#">Reset Filters</a>
        </div>
        <div id="side-menu-purchases">
          <div id="side-menu-purchases-header">
            <div id="left">
              <span className="uk-margin-medium-left" uk-icon="arrow-left" />
            </div>
            <div id="center">
              <h4 id="side-menu-purchases-title" className="color-primary">
                {this.state.viewType}
              </h4>
            </div>
            <div id="right">
              <span className="uk-margin-medium-right" uk-icon="close" />
            </div>
          </div>
          <div className="uk-margin">
            <form className="uk-search uk-search-default uk-width-3-4">
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
              />
            </form>
            <div id="right">
              <a href="#"> Sort </a> |
              <span className="uk-margin-small-right" uk-icon="thumbnails" />
            </div>
          </div>
          <p id="number-purchases-text"> {this.state.orders.length || 0} purchases found </p>
          {this.state.isLoading ? (
            <div uk-spinner="ratio: 2" />
          ) : this.state.orders.length > 0 ? (
            this.state.orders.map(order => (
              <Link
                to={`/order/${order.orderId}`}
                key={order.orderId}
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
}

export default History
