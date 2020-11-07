export const SELECT_A_PLAN = 'Select A Plan'


export const DISCOUNT_MONTHLY_PLAN = {
  name: 'Holiday Sale!',
  price: '$30',
  frequency: 'Monthly',
  url: '/discount-monthly-plan',
  billed: '$30/month, auto-renews',
  intPrice: 3000
}


export const MONTHLY_PLAN = {
  name: 'Monthly Plan',
  price: '$60',
  frequency: 'Monthly',
  url: '/monthly-plan',
  billed: '$60/month, auto-renews',
  intPrice: 6000
}

export const QUARTERLY_PLAN = {
  name: 'Quarterly Plan',
  price: '$150',
  frequency: 'Quarterly',
  url: '/quarterly-plan',
  billed: '$150 every three months. auto-renews',
  intPrice: 15000
}

export const YEARLY_PLAN = {
  name: 'Yearly Plan',
  price: '$500',
  frequency: 'Yearly',
  url: '/yearly-plan',
  billed: '$500 every year. auto-renews',
  intPrice: 50000
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

export const SubscriptionCardData = {
  header: 'Subscribe Now!',
  paragraph:
    'Try out our Option Flow unusual activity for $60 a month. No commitments. Cancel anytime',
  buttonChildren: 'Sign up',
  url: '/register',
}

export const OPTIONFLO_PLANS = [MONTHLY_PLAN, QUARTERLY_PLAN, YEARLY_PLAN]
