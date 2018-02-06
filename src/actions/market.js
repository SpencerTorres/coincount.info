import {
  MARKET_SET_DATA,
  MARKET_SET_FIAT,
  MARKET_WAITING,
  MARKET_ERROR
} from '../types'
import axios from 'axios'

export function requestMarketData() {
  return (dispatch, getState) => {
    let fiat = getState().market.fiat

    dispatch({ type: MARKET_WAITING })
    return axios.get(`https://api.coinmarketcap.com/v1/ticker/?limit=0&convert=${fiat}`).then(res => {
      dispatch({ type: MARKET_SET_DATA, marketData: res.data })
    })
    .catch(error => {
      dispatch({ type: MARKET_ERROR })
    })
  }
}

export function changeFiat(newFiat) {
  return (dispatch, getState) => {
    if(getState().market.fiats.includes(newFiat)) {
      dispatch({ type: MARKET_SET_FIAT, fiat: newFiat })
      dispatch(requestMarketData())
    }
  }
}
