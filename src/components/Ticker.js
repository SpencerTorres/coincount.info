import React, { Component } from 'react'
import getSymbolFromCurrency from 'currency-symbol-map'
import { addCommas } from '../util/Helpers'

export default class Ticker extends Component {
  render() {
    let { coin, fiat, owned } = this.props
    if(owned && typeof owned === 'object')
      owned = parseFloat(owned[0])
    let ownedValue = coin[`price_${fiat.toLowerCase()}`] * parseFloat(owned)
    if(!coin || !coin.id)
      return <div/>
    return (
      <div className='ticker'>
        <a href={`https://CoinMarketCap.com/currencies/${coin.id}`} target='_blank' rel='noopener noreferrer'>
          <img src={`https://files.coinmarketcap.com/static/img/coins/128x128/${coin.id}.png`} alt={coin.name}/>
        </a>
        <h1 style={{margin: 0}}>{coin.name}</h1>
        <h4 style={{margin: 0}} className='subtle'>{coin.symbol}</h4>
        { parseFloat(owned) > 0 &&
          <div>
            <hr/>
            <h2 className='ownedValue' style={{margin: '2px'}}>{`${getSymbolFromCurrency(fiat)}${addCommas(ownedValue > 0.01 ? parseFloat(ownedValue).toFixed(2) : parseFloat(ownedValue).toFixed(8))}`}</h2>
            <h3 className='subtle' style={{margin: '2px'}}>{parseFloat(owned).toFixed(8)}</h3>
          </div>
        }
        <hr/>
        <h4 style={{margin: 0}} className='subtle'>HOUR <span className={coin.percent_change_24h >= 0 ? 'positive' : 'negative'}>{`${coin.percent_change_24h || '-'}%`}</span></h4>
        <h4 style={{margin: 0}} className='subtle'>DAY <span className={coin.percent_change_1h >= 0 ? 'positive' : 'negative'}>{`${coin.percent_change_1h || '-'}%`}</span></h4>
        <h4 style={{margin: 0}} className='subtle'>WEEK <span className={coin.percent_change_7d >= 0 ? 'positive' : 'negative'}>{`${coin.percent_change_7d || '-'}%`}</span></h4>
        <hr/>
        <h2 className='subtle' style={{margin: '2px'}}>{`${getSymbolFromCurrency(fiat)}${addCommas(coin[`price_${fiat.toLowerCase()}`])}`}</h2>
        <h3 className='subtle' style={{margin: '2px'}}>{`${getSymbolFromCurrency('BTC')} ${coin.price_btc}`}</h3>
      </div>
    )
  }
}
