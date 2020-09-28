export const FILTER_SELECTION = [
  {name: 'Opening Orders', value: 'A', type: 'description'},
  // {name: '$1M and above', value: 1000000, type: 'cost_basis'},
  // {name: '$500k and above', value: 500000, type: 'cost_basis'},
  {name: 'Above ask', value: 'A', type: 'description'},
  {name: 'Stocks only', value: 'STOCK', type: 'underlying_type'},
  {name: 'ETFs only', value: 'ETF', type: 'underlying_type'},
  {name: 'Calls only', value: 'CALL', type: 'put_call'},
  {name: 'Puts only', value: 'PUT', type: 'put_call'},
  // {name: 'Weeklies', value: new Date(), type: 'date_expiration'},
  // {name: '$0.50 and less', value: 0.5, type: 'description'},
]
