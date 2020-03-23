import React from 'react'
import TradingViewWidget, {Themes} from 'react-tradingview-widget'
import TechnicalAnalysis from 'react-tradingview-technical-analysis'
import socketIOClient from 'socket.io-client'

import styles from './Flow.module.css'

export default class Flow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
    }
  }

  componentDidMount() {
    let self = this
    document.getElementsByClassName(
      'tradingview-widget-container'
    )[0].style.margin = 'auto'

    const socket = socketIOClient('http://localhost:8080')

    socket.on('all_options', data => self.setState({options: data}))
    socket.on('options', function (data) {
      let options = self.state.options
      options.unshift(...data)

      self.setState({
        options: options,
      })
    })
  }

  render() {
    let elements = this.state.options.map(e => (
      <div className={styles.flow_list}>
        <div className={styles.time}>{e.time}</div>
        <div className={styles.ticker}>{e.ticker}</div>
        <div className={styles.date_expiration}>{e.date_expiration}</div>
        <div className={styles.strike_price}>{e.strike_price}</div>
        <div className={styles.put_call}>{e.put_call}</div>
        <div className={styles.option_activity_type}>
          {e.option_activity_type}
        </div>
        <div className={styles.description}>{e.description}</div>
        <div className={styles.sentiment}>{e.sentiment}</div>
        <div className={styles.cost_basis}>{e.cost_basis}</div>
      </div>
    ))

    const USE_SYMBOL = 'VXX'
    return (
      <div>
        <div>
          <TechnicalAnalysis symbol={USE_SYMBOL} className={styles.container} />
          <TradingViewWidget symbol={USE_SYMBOL} theme={Themes.DARK} />

          <ul>{elements}</ul>
        </div>
      </div>
    )
  }
}
