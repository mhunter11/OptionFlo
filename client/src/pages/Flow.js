import React from "react";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import TechnicalAnalysis from "react-tradingview-technical-analysis";
import socketIOClient from "socket.io-client";

import styles from "./Home.module.css";

export default class Flow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
    };
  }

  componentDidMount() {
    let self = this;
    document.getElementsByClassName(
      "tradingview-widget-container"
    )[0].style.margin = "auto";

    const socket = socketIOClient("http://localhost:8080");

    socket.on("all_options", (data) => self.setState({ options: data }));
    socket.on("options", function (data) {
      let options = self.state.options;
      options.unshift(...data);

      self.setState({
        options: options,
      });
    });
  }

  render() {
    let elements = this.state.options.map((e) => (
      <li>
        {e.time}
        {e.ticker}
        {e.date_expiration}
        {e.strike_price}
        {e.put_call}
        {e.option_activity_type}
        {e.description}
        {e.sentiment}
        {e.cost_basis}
      </li>
    ));

    const USE_SYMBOL = "VXX";
    return (
      <div>
        <div>
          <TechnicalAnalysis symbol={USE_SYMBOL} className={styles.container} />
          <TradingViewWidget symbol={USE_SYMBOL} theme={Themes.DARK} />

          <ul>{elements}</ul>
        </div>
      </div>
    );
  }
}
