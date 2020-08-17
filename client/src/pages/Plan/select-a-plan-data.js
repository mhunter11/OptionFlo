export const SELECT_A_PLAN = 'Select A Plan'

export const MONTHLY_PLAN = {
  name: 'Monthly Plan',
  price: '$60',
  frequency: 'Monthly',
  url: '/monthly-plan',
  billed: '$60/month, auto-renews'
}

export const QUARTERLY_PLAN = {
  name: 'Quarterly Plan',
  price: '$150',
  frequency: 'Quarterly',
  url: '/quarterly-plan',
  billed: '$150 every three months. auto-renews'
}

export const YEARLY_PLAN = {
  name: 'Yearly Plan',
  price: '$500',
  frequency: 'Yearly',
  url: '/yearly-plan',
  billed: '$500 every year. auto-renews'
}

export const SUBSCRIPTION_BENEFITS = [
  'Realtime Option Order Flow',
  'Unusual Options Activity',
  'Access to OptionFlo Discord',
  'Access to our Top Traders',
  'Option Alerts',
  // 'Equity Block (coming soon)',
  // 'Dark Pool Order Data (coming soon)',
]

export const OPTIONFLO_PLANS = [MONTHLY_PLAN, QUARTERLY_PLAN, YEARLY_PLAN]
