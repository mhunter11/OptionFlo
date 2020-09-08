export function formatTime(time) {
  const date = new Date(time * 1000)
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  }
  const newTime = new Intl.DateTimeFormat('en-US', options).format(date)
  return newTime
}

export function formatSentiment(data) {
  if (data === 'null') {
    return 'MIDPOINT'
  }

  return data
}

export function getRef(ref) {
  return ref.split('Ref')[1].split('=')[1]
}

export function getOI(oi) {
  return oi.split('vs')[1].split('OI')[0].trim()
}

export function getBuy(buy) {
  return buy.split('@')[0].split(':')[2].trim()
}

export function getContractPrice(contract_price) {
  return contract_price.split(':')[2].split('vs')[0]
}

export function getGoldenSweep(cost_basis, type, buy, oi) {
  return (
    parseInt(cost_basis) >= 1000000 &&
    type === 'SWEEP' &&
    parseInt(buy) > parseInt(oi)
  )
}

export function getBigBuy(buy) {
  return parseInt(buy) >= 10000
}

export function getFormattedExpirationDate(date) {
  const newDate = date.substring(2).replace(/-/g, ' /').trim()
  const YEAR = newDate.split('/')[0].trim()
  const MONTH = newDate.split('/')[1].trim()
  const DAY = newDate.split('/')[2].trim()
  const FORMATTED_EXPIRATION_DATE = `${MONTH}-${DAY}-${YEAR}`
  return FORMATTED_EXPIRATION_DATE
}

export function getContractAndPrice(contract) {
  if (contract.split('@')[1].length === 8) {
    let CONTRACT_PRICE = contract.split('@')[1]
    CONTRACT_PRICE = CONTRACT_PRICE.slice(0, -2)

    const NEW_CONTRACT_AND_PRICE = `${
      contract.split('@')[0]
    } @ ${CONTRACT_PRICE}`

    return NEW_CONTRACT_AND_PRICE
  }

  return contract
}

export function getTicker(ticker) {
  if (ticker === 'CALL') {
    return 'C'
  }

  return 'P'
}

export function getTickerOnMobile(ticker) {
  if (ticker === 'CALL') {
    return 'CALL'
  }

  return 'PUT'
}

export function getBidOrAskOrder(contract) {
  if (contract.split(')')[1] !== undefined) {
    const ask_bid = contract.split(')')[1].split(':')[0].trim()
    if (ask_bid === 'near the Bid') {
      return 'B'
    } else if (ask_bid === 'near the Ask') {
      return 'A'
    } else if (ask_bid === 'above Ask!') {
      return 'AA'
    } else {
      return 'BB'
    }
  } else {
    const ask_bid = contract.split('at the')[1].split(':')[0].trim()
    if (ask_bid === 'Ask') {
      return 'A'
    } else {
      return 'B'
    }
  }
}

export function todayDate() {
  let today = new Date()
  let dd = String(today.getDate()).padStart(2, '0')
  let mm = String(today.getMonth() + 1).padStart(2, '0')
  let yyyy = today.getFullYear()

  today = yyyy + '-' + mm + '-' + dd
  return today
}
