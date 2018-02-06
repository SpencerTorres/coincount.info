import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Doughnut, Chart } from 'react-chartjs-2'
import getSymbolFromCurrency from 'currency-symbol-map'
import { addCommas } from '../util/Helpers'

let originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
  draw() {
    originalDoughnutDraw.apply(this, arguments)
    let chart = this.chart
    let ctx = chart.chart.ctx

    // I never want to use JSON again.
    let ownedValueData = Object.keys(chart.config.data['datasets'][0]['_meta'])
    // ChartJS likes to put new chart data on a new tooltip index, this finds the latest one and uses it.
    let ownedValue = parseFloat(chart.config.data['datasets'][0]['_meta'][ownedValueData[ownedValueData.length - 1]]['total'])

    let txt = `${getSymbolFromCurrency(chart.config.data.fiat)}${addCommas(ownedValue > 0.01 ? parseFloat(ownedValue).toFixed(2) : parseFloat(ownedValue).toFixed(8))}`
    let sidePadding = 20
    let sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
    ctx.font = `30px sans-serif`

    let stringWidth = ctx.measureText(txt).width
    let elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated

    let widthRatio = elementWidth / stringWidth
    let newFontSize = Math.floor(30 * widthRatio)
    let elementHeight = (chart.innerRadius * 2)

    let fontSizeToUse = Math.min(newFontSize, elementHeight)

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    let centerX = ((chart.chartArea.left + chart.chartArea.right) / 2)
    let centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2)
    ctx.font = `${fontSizeToUse}px 'Open Sans', sans-serif`
    ctx.fillStyle = '#d1c15e'

    ctx.fillText(txt, centerX, centerY)
  }
})

const getRandomColor = () =>{
    let letters = '789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++ )
        color += letters[Math.floor(Math.random() * letters.length)]

    return color
}

const popularCoinColors = {
  bitcoin: '#F8A23A',
  'bitcoin-cash': '#F7931A',
  gas: '#74BC2A',
  verge: '#00C7FC',
  monero: '#FF6600',
  dash: '#0074B6',
  ripple: '#0891C8',
  iota: '#BFBFBF',
  ethereum: '#828384',
  litecoin: '#F5F5F5',
  neo: '#B1DD0A',
  'ethereum-classic': '#669073',
  dogecoin: '#BA9F33',
  nem: '#2CBAAD'
}

class ChartData extends Component {
  generateChartData(marketData, fiat, portfolio) {
    let labels = []
    let coinData = []
    let backgroundColors = []
    let totalValue = 0
    for(let index in portfolio) {
      let coin = marketData[index]
      if(!coin)
        continue
      let owned = portfolio[index]
      if(owned && typeof owned === 'object')
        owned = parseFloat(owned[0])
      if(!owned || parseFloat(owned) <= 0)
        continue
      labels.push(coin.name)
      let ownedValue = coin[`price_${fiat.toLowerCase()}`] * owned
      coinData.push(ownedValue)
      backgroundColors.push(popularCoinColors[coin.id] || getRandomColor())
      totalValue += ownedValue
    }
    return {
      labels,
    	datasets: [{
    		data: coinData,
    		backgroundColor: backgroundColors,
        borderWidth: 0
    	}],
      fiat,
      totalValue
    }
  }
  render() {
    let { market, portfolio } = this.props
    return (
      <div id='chartArea'>
        <Doughnut data={this.generateChartData(market.coins, market.fiat, portfolio)}
          width={500}
	        height={500}
	        options={{
            cutoutPercentage: 65,
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                fontSize: 18,
                padding: 25,
                fontColor: '#777'
              }
            },
            tooltips: {
              callbacks: {
                title(tooltipItem, data) {
                  return data['labels'][tooltipItem[0]['index']]
                },
                label(tooltipItem, data) {
                  let ownedValue = data['datasets'][0]['data'][tooltipItem['index']]
                  return `${getSymbolFromCurrency(data.fiat)}${addCommas(ownedValue > 0.01 ? parseFloat(ownedValue.toFixed(2)) : parseFloat(ownedValue.toFixed(8)))}`
                },
                afterLabel(tooltipItem, data) {
                  let dataset = data['datasets'][0]
                  let metaset = Object.keys(dataset['_meta'])
                  let percent = ((dataset['data'][tooltipItem['index']] / dataset['_meta'][metaset[metaset.length - 1]]['total']) * 100).toFixed(2)
                  return `(${percent}%)`
                }
              },
              backgroundColor: '#555',
              titleFontSize: 20,
              titleFontColor: '#d1c15e',
              bodyFontColor: '#EEE',
              bodyFontSize: 18,
              displayColors: false
            },
		        maintainAspectRatio: false
	        }}
        />
      </div>
    )
  }
}

ChartData.propTypes = {
  market: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    market: state.market
  }
}

export default connect(mapStateToProps)(ChartData)
