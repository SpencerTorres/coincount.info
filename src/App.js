import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { requestMarketData, changeFiat } from './actions/market'

import './App.css'

import Home from './pages/Home'
import Portfolio from './pages/Portfolio'

class App extends Component {
  componentWillMount() {
    let portfolio = queryString.parse(this.props.location.search)
    this.props.changeFiat(portfolio.fiat || 'USD')

    setInterval(() => {
      this.props.requestMarketData()
    }, 300000) // Reload every 5 minutes
  }

  render() {
    let portfolio = queryString.parse(this.props.location.search)

    if(portfolio.fiat)
      delete portfolio['fiat']
    if(portfolio.name)
      delete portfolio['name']

    if(Object.keys(portfolio).length < 1)
      return <Home/>
    return <Portfolio portfolio={portfolio}/>
  }
}

App.propTypes = {
  requestMarketData: PropTypes.func.isRequired,
  changeFiat: PropTypes.func.isRequired
}

export default connect(null, { requestMarketData, changeFiat })(App)
