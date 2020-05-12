export function formatTime(time) {
  const date = new Date(time * 1000)
  const hours = date.getHours()
  const minutes = '0' + date.getMinutes()
  const seconds = '0' + date.getSeconds()
  const formattedTime =
    hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)

  return formattedTime
}

export function formatSentiment(data) {
  if (data === 'null') {
    return 'MIDPOINT'
  }

  return data
}
