import React, { useEffect } from 'react'
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import TechnicalAnalysis from 'react-tradingview-technical-analysis'

import styles from './Home.module.css'


export default function Flow() {
  useEffect(() => {
    document.getElementsByClassName("tradingview-widget-container")[0].style.margin = "auto"
  }, [])

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
      </div>
    </div>
  )
}
