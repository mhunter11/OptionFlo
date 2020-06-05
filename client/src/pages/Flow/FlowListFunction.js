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
  return buy.split('@')[0].split(':')[2]
}

export function getContractPrice(contract_price) {
  return contract_price.split(':')[2].split('vs')[0]
}

export function getGoldenSweep(cost_basis, type, buy, oi) {
  return parseInt(cost_basis) >= 1000000 && type === 'SWEEP' && buy > oi
}

export function getBigBuy(buy) {
  return parseInt(buy) >= 10000
}
