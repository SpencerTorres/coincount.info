import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { requestMarketData, changeFiat } from '../actions/market'
import Helmet from 'react-helmet'
import Fuse from 'fuse.js'

import { CoinBox, CoinBoxInput } from '../components/AddCoinInput'

const searchOptions = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [{
    name: 'id',
    weight: 0.25
  }, {
    name: 'name',
    weight: 0.35
  }, {
    name: 'symbol',
    weight: 0.4
  }]
}


class Home extends Component {
  constructor(props) {
    super(props)
    this.state = { searchText: '', portfolio: [], portfolioMap: {} }
    this.onSearchTextChange = this.onSearchTextChange.bind(this)
    this.addCoin = this.addCoin.bind(this)
    this.remCoin = this.remCoin.bind(this)
    this.setCoinValue = this.setCoinValue.bind(this)
  }

  onSearchTextChange(e) {
    this.setState({ searchText: e.target.value })
  }

  addCoin(coinID) {
    if(this.state.portfolio.includes(coinID))
      return
    let safeState = this.state.portfolio.slice()
    safeState.push(coinID)
    this.setState({ portfolio: safeState, searchText: '' })
  }
  remCoin(coinID) {
    this.setState({ portfolio: this.state.portfolio.filter(c => c !== coinID) })
  }

  setCoinValue(coin, value) {
    let safeState = Object.assign({}, this.state.portfolioMap)
    safeState[coin] = value
    this.setState({ portfolioMap: safeState })
  }

  render() {
      let { searchText, portfolio, portfolioMap } = this.state
      let { market } = this.props

      let fuse = new Fuse(market.coinList, searchOptions)

      let coinList = []
      if(searchText !== '')
        coinList = fuse.search(searchText).slice(0, 5)
      else {
        let limit10 = 0
        for(let index in market.coins) {
          if(limit10 === 10)
            break
          if(portfolio.includes(index))
            continue
          coinList.push({ id: index })
          limit10++
        }
      }

      let builtPortfolio = {}
      for(let index in portfolio)
        builtPortfolio[portfolio[index]] = portfolioMap[portfolio[index]] || 1
      let portfolioLink = queryString.stringify(builtPortfolio)
      let portfolioValid = portfolioLink.length > 0

      return (
        <div id='main'>
          <img src='/banner.png' alt='coincount.info' width={500}/>
          <Helmet>
            <title>{`coincount.info`}</title>
          </Helmet>
          <div className='footnote'>
            <h2>{'The simplest bookmarkable cryptocurrency tracker'.toUpperCase()}</h2>
          </div>
          <br/><br/>
          { portfolioValid && <NavLink id='getUrlButton' to={`?${portfolioLink}`}>GET URL</NavLink> }
          { portfolioValid && <div className='hr'/> }

          <div className='tickers'>
            {portfolio.map(coinID => {
              return <CoinBoxInput key={coinID} fiat={market.fiat} coin={market.coins[coinID] || {}} onValueChange={this.setCoinValue} onClick={() => this.remCoin(coinID)}/>
            })}
          </div>
          <div className='hr'/>
          <input id='searchInput'
            type='text'
            placeholder='Search for coin...'
            onChange={this.onSearchTextChange}
            value={searchText}
            maxLength={32}
          />
          <div className='hr'/>
          <div className='tickers'>
            {coinList.map(coin => {
              let coinID = coin.id
              if(portfolio.includes(coinID))
                return <span/>
              return <CoinBox key={coinID} fiat={market.fiat} coin={market.coins[coinID] || {}} onClick={() =>this.addCoin(coinID)}/>
            })}
          </div>
          <div className='hr'/>
          <div className='footnote'>
            <i>Market data and images provided by the public <a href='https://CoinMarketCap.com' target='_blank' rel='noopener noreferrer'>CoinMarketCap.com</a> API</i>
          </div>
          <br/>
        </div>
      )
  }
}

Home.propTypes = {
  requestMarketData: PropTypes.func.isRequired,
  changeFiat: PropTypes.func.isRequired,
  market: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    market: state.market
  }
}

export default connect(mapStateToProps, { requestMarketData, changeFiat })(Home)
