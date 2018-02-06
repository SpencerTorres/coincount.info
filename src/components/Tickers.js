import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Ticker from './Ticker'

class Tickers extends Component {
  render() {
    let { market, portfolio } = this.props

    return (
      <div className='tickers'>
        {Object.keys(portfolio).map(coinID => {
            return <Ticker key={coinID} fiat={market.fiat} coin={market.coins[coinID] || {}} owned={portfolio[coinID] || 0}/>
        })}
      </div>
    )
  }
}

Tickers.propTypes = {
  market: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    market: state.market
  }
}

export default connect(mapStateToProps)(Tickers)
