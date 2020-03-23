import React from 'react'
import TradingViewWidget, {Themes} from 'react-tradingview-widget'
import TechnicalAnalysis from 'react-tradingview-technical-analysis'
import socketIOClient from 'socket.io-client'

import FlowList from './FlowList'

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
    const USE_SYMBOL = 'VXX'
    return (
      <div>
        <div>
          <TechnicalAnalysis symbol={USE_SYMBOL} className={styles.container} />
          <TradingViewWidget symbol={USE_SYMBOL} theme={Themes.DARK} />

          <ul>
            {this.state.options.map((data, index) => (
              <FlowList {...data} key={index} />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
