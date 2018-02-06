import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { requestMarketData, changeFiat } from '../actions/market'
import Helmet from 'react-helmet'
import { addCommas } from '../util/Helpers'
import getSymbolFromCurrency from 'currency-symbol-map'

import Chart from '../components/Chart'
import Tickers from '../components/Tickers'

class Portfolio extends Component {
  render() {
    let { market, portfolio } = this.props
    let name = portfolio.name

    let totalValue = 0
    for(let index in portfolio) {
      let coin = market.coins[index]
      if(!coin)
        continue
      let owned = portfolio[index]
      if(owned && typeof owned === 'object')
        owned = parseFloat(owned[0])
      if(!owned || parseFloat(owned) <= 0)
        continue
      totalValue += coin[`price_${market.fiat.toLowerCase()}`] * owned
    }

    return (
      <div id='main'>
        <Link to='/'><img src='/banner.png' alt='coincount.info' width={300}/></Link>
        <br/>
        {
          <Helmet>
            <title>{`${(name && name !== '') ? `${name} | ` : ''}${getSymbolFromCurrency(market.fiat)}${addCommas(totalValue > 0.01 ? parseFloat(totalValue.toFixed(2)) : parseFloat(totalValue.toFixed(8)))} | coincount.info`}</title>
          </Helmet>
        }
        { (name && name !== '') && <h1>{name}</h1> }
        <br/>
        <Chart portfolio={portfolio}/>
        <br/>
        <Tickers portfolio={portfolio}/>
        <br/>
        <div className='hr'/>
        <br/>
        <div className='footnote'>
          <i>Market data and images provided by the public <a href='https://CoinMarketCap.com' target='_blank' rel='noopener noreferrer'>CoinMarketCap.com</a> API</i>
        </div>
        <br/>
      </div>
    )
  }
}

Portfolio.propTypes = {
  requestMarketData: PropTypes.func.isRequired,
  changeFiat: PropTypes.func.isRequired,
  market: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    market: state.market
  }
}

export default connect(mapStateToProps, { requestMarketData, changeFiat })(Portfolio)
