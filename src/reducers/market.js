import {
  MARKET_SET_DATA,
  MARKET_SET_FIAT,
  MARKET_WAITING,
  MARKET_ERROR
} from '../types'
import moment from 'moment'

const initialState = {
  fiat: 'USD',
  fiats: [
    'AUD', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'CZK', 'DKK', 'EUR',
    'GBP', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW', 'MXN',
    'MYR', 'NOK', 'NZD', 'PHP', 'PKR', 'PLN', 'RUB', 'SEK', 'SGD',
    'THB', 'TRY', 'TWD', 'USD', 'ZAR'
  ],
  coins: {},
  coinList: [],
  lastUpdated: 0,
  waiting: false,
  error: false
}

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case MARKET_SET_FIAT:
      return Object.assign({}, state, {
        fiat: action.fiat
      })
    case MARKET_SET_DATA:
      let rawMarketData = action.marketData
      let marketData = {}
      let coinList = []

      // Convert array of coins into an associative object
      for(let index in rawMarketData) {
        let coin = rawMarketData[index]
        marketData[coin.id] = coin
        coinList.push({ id: coin.id, name: coin.name, symbol: coin.symbol })
      }

      return Object.assign({}, state, {
        coins: marketData,
        coinList: coinList,
        lastUpdated: moment().unix(),
        waiting: false
      })
    case MARKET_WAITING:
      return Object.assign({}, state, {
        waiting: true
      })
    case MARKET_ERROR:
      return Object.assign({}, state, {
        waiting: false,
        error: true
      })
    default: return state
  }
}
