export const FLOW_ROW_NAME = [
  {className: '7.5', name: 'Time', padding: '1.5'},
  {className: '6', name: 'Ticker', padding: '2.25'},
  {className: '6.5', name: 'Expiration'},
  {className: '6.5', name: 'Strike', padding: '0.5'},
  {className: '8', name: 'Call/PUt'},
  {className: '5.5', name: 'Type'},
  {className: '10.5', name: 'Contract & Price', marginRight: true},
  // {className: '7.5', name: 'Sentiment'},
  {className: '8', name: 'Cost'},
  {className: '5', name: 'O/I', padding: '1'},
  {className: 'row_ref', name: 'Ref'},
]

export const HISTORICAL_FLOW_ROW_NAME = [
  {className: '7.5', name: 'Date', padding: '1.5'},
  {className: '6', name: 'Ticker', padding: '2.25'},
  {className: '6.5', name: 'Expiration'},
  {className: '6.5', name: 'Strike', padding: '0.5'},
  {className: '8', name: 'C/P'},
  {className: '5.5', name: 'Type'},
  {className: '10.5', name: 'Contract & Price'},
  // {className: '7.5', name: 'Sentiment'},
  {className: '8', name: 'Cost'},
  {className: '5', name: 'O/I', padding: '1'},
  {className: 'row_ref', name: 'Ref'},
]

export const HEIGHT = 900
export const WIDTH = 1250
export const ITEM_SIZE = 60
export const CLASSNAME = 'List'

export const MOBILE_WIDTH = 530
export const MOBILE_HEIGHT = 700
export const MOBILE_ITEM_SIZE = 150

export const ASK = 'Opening Orders'
export const ONE_MILL = '$1M and above'
export const FIVE_HUNDRED = '$500k and above'
export const ABOVE_ASK = 'Above Ask'
export const STOCK_ONLY = 'Stocks Only'
export const ETFS_ONLY = 'ETFs Only'
export const CALLS_ONLY = 'Calls Only'
export const PUTS_ONLY = 'Put Only'
export const WEEKLIES = 'Weeklies'
export const FIFTY_CENTS = '$0.50 and less'
export const SWEEPS_ONLY = 'Sweeps Only'
export const GOLDEN_SWEEP = 'Golden Sweep'
export const TENK_ORDER = 'Big buy'

export const FILTER_SELECTION_DATA = [
  {name: ASK},
  {name: ONE_MILL},
  {name: FIVE_HUNDRED},
  {name: ABOVE_ASK},
  {name: STOCK_ONLY},
  {name: ETFS_ONLY},
  {name: CALLS_ONLY},
  {name: PUTS_ONLY},
  {name: WEEKLIES},
  {name: FIFTY_CENTS},
  {name: SWEEPS_ONLY},
]

export const FILTER_SELECTION = [
  {name: ASK, value: 'A', type: 'description'},
  {name: ONE_MILL, value: 1000000, type: 'cost_basis'},
  {name: FIVE_HUNDRED, value: 500000, type: 'cost_basis'},
  // {name: ABOVE_ASK, value: 'A', type: 'description'},
  {name: STOCK_ONLY, value: 'STOCK', type: 'underlying_type'},
  {name: ETFS_ONLY, value: 'ETF', type: 'underlying_type'},
  {name: CALLS_ONLY, value: 'CALL', type: 'put_call'},
  {name: PUTS_ONLY, value: 'PUT', type: 'put_call'},
  // {name: WEEKLIES, value: new Date(), type: 'date_expiration'},
  {name: FIFTY_CENTS, value: 0.5, type: 'description'},
  {name: SWEEPS_ONLY, value: 'SWEEP', type: 'option_activity_type'},
  {name: GOLDEN_SWEEP, value: 'GOLDEN', type: 'description'},
  {name: TENK_ORDER, value: '10k Order', type: 'description'},
]
