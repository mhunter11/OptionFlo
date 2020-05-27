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
