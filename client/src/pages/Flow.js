import React from 'react';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import TechnicalAnalysis from 'react-tradingview-technical-analysis';
import socketIOClient from "socket.io-client";

import styles from './Home.module.css'

export default class Flow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      options: []
    }
  }

  
  componentDidMount() {
    document.getElementsByClassName("tradingview-widget-container")[0].style.margin = "auto";

    const socket = socketIOClient('http://localhost:8080');

    socket.on("all_options", data => this.setState({ options: data }));
    socket.on("options", data => this.setState({ options: this.state.options.unshift(...data) }));
  }
  
  render() {
    let elements = this.state.options.map(e => <li>{e.ticker}</li> );

    const USE_SYMBOL = 'VXX'
    return (
      <div>
        <div>
          <TechnicalAnalysis
            symbol={USE_SYMBOL}
            className={styles.container}
          />
          <TradingViewWidget
            symbol={USE_SYMBOL}
            theme={Themes.DARK}
          />

          <ul>
            {elements}
          </ul>

        </div>
      </div>
    )
  }
}
