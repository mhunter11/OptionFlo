require('dotenv').config()
const xml2js = require('xml2js')
const fetch = require('node-fetch')
const date = require('date-and-time')
const io = require('socket.io')(1337)
const {saveOptions} = require('./upload.js')

//Date Config
const parser = new xml2js.Parser(/* options */)
const date_pattern = date.compile('YYYY-MM-DD HH:mm:ss')

//API Config
const API = process.env.BENZINGA_API_KEY

//Data
var lastOptionID = null
var allData = []

var backlog = []

var lastResetTime = new Date()

function formatData(data) {
  data = data.map(e => {
    const keys = Object.keys(e)

    for (let i = 0; i < keys.length; i++) {
      e[keys[i]] = e[keys[i]][0]
    }

    return e
  })

  data = data.map(e => {
    const keys = Object.keys(e)

    for (let i = 0; i < keys.length; i++) {
      switch (keys[i]) {
        case 'date': {
          const parsedDate = date.parse(
            e['date'] + ' ' + e['time'],
            date_pattern
          )
          e['date'] = parsedDate
          break
        }
        default:
          break
      }
    }

    return e
  })

  return data
}

async function fetchLatest() {
  let now = new Date()

  if (now.getHours() == 9 && (now - lastResetTime) / 1000 / 60 / 60 > 23) {
    lastResetTime = now

    allData = [] //Clear options

    console.log('clear')

    io.emit('clear') //Tell connected clients to clear
  }

  console.log('Checking for updates..')
  const response = await fetch(API)
  const xml = await response.text()

  const parsedData = await parser.parseStringPromise(xml)
  let all_options = parsedData.result.option_activity[0].item

  all_options = formatData(all_options)

  console.log('Got ' + all_options.length + ' options')

  let new_options = []
  if (lastOptionID != null) {
    for (let i = 0; i < all_options.length; i++) {
      let id = all_options[i].id

      if (id == lastOptionID) {
        break
      }

      new_options.push(all_options[i])
    }
  } else {
    new_options = all_options
  }

  console.log('Got ' + new_options.length + ' new options')

  if (new_options.length == 0) {
    return false
  } else {
    lastOptionID = new_options[0].id

    allData.unshift(...new_options)

    let toReturn = new_options

    try {
      //If there are items that failed last time
      //Include in this call
      if (backlog.length > 0) {
        //We need to clone it if the backlog isn't empty
        //Otherwise, unshift will change toReturn
        toReturn = [...new_options]
      }

      new_options.unshift(...backlog)

      //Push new options
      await saveOptions(new_options)

      //If we are successful, clear the backlog
      backlog = []
    } catch (e) {
      console.log(e)

      //If we error, add the items we wanted to push to the backlog
      //so it will be included next time
      backlog.unshift(...new_options)
    }

    return toReturn
  }
}

setInterval(function () {
  fetchLatest().then(function (result) {
    if (result) {
      console.log('Emitting event with ' + result.length + ' new results')
      io.emit('options', result)
    }
    console.log('All done')
  })
}, 5 * 1000)

io.on('connection', function (socket) {
  socket.emit('all_options', allData)
})
