import React, { Component } from 'react'
import NumericInput from 'react-numeric-input'
import CloseIcon from 'react-icons/lib/fa/close'

export class CoinBox extends Component {
  render() {
    let { coin } = this.props
    return (
      <div className='coinTile ticker' onClick={this.props.onClick}>
        <h2 style={{margin: 0}}>{coin.name}</h2>
        <h5 style={{margin: 0}} className='subtle'>{coin.symbol}</h5>
      </div>
    )
  }
}

export class CoinBoxInput extends Component {
  constructor(props) {
    super(props)
    this.state = { value: 1 }
    this.onValueChange = this.onValueChange.bind(this)
  }

  onValueChange(value) {
    this.setState({ value })
    this.props.onValueChange(this.props.coin.id, value)
  }

  render() {
    let { value } = this.state
    let { coin } = this.props

    return (
      <div className='coinTile ticker'>
        <h2 style={{margin: 0}}>{coin.name}</h2>
        <h5 style={{margin: 0}} className='subtle'>{coin.symbol}</h5>

        <NumericInput
          className='coinInput'
          style={false}
          step={0.00000005}
          min={0.00000001}
          precision={8}
          onChange={this.onValueChange}
          value={value}
          snap
        />
        <div style={{float:'right'}} onClick={this.props.onClick}>
          <CloseIcon className='icon'/>
        </div>
      </div>
    )
  }
}
