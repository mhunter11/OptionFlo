require('dotenv').config()
const port = process.env.PORT || 8080
const xml2js = require('xml2js')
const fetch = require('node-fetch')
const date = require('date-and-time')
const io = require('socket.io')(port)
const {saveOptions} = require('./upload.js')

//Date Config
const parser = new xml2js.Parser(/* options */)
const date_pattern = date.compile('YYYY-MM-DD HH:mm:ss')

//API Config
const API = process.env.BENZINGA_API_KEY

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

class OptionCollection {
  constructor(limit = 500) {
    this.data = []
    this.new_options = []
    this.backlog = [];
    this.lastOptionID = null;

    this.sizeLimit = limit;
  }

  size() {
    /**
     * The current size of the data array
     */
    return this.data.length;
  }

  async update() {
    /**
     * Pull the latest options from the API and push new 
     * options to the database. 
     * To grab the new options, you can use this.new_options
     */
    let now = new Date()

    if (now.getHours() == 9 && (now - this.lastResetTime) / 1000 / 60 / 60 > 23) {
      this.lastResetTime = now
  
      this.allData = [] //Clear options
  
      console.log('clear')
  
      io.emit('clear') //Tell connected clients to clear
    }

    console.log('Checking for updates..')
    
    //Grab all options from the API
    let all_options = await this.grabFromAPI();

    //update new_options to only contain new items
    this.addNewOptions(all_options);

    //Push the contents of backlog + new_options
    await this.pushNewOptions();

    //Trim the beginning of data if it exceeds the limit
    trimData();
  }

  async grabFromAPI() {
    /**
     * Grab all options from the API
     */
    const response = await fetch(API)
    const xml = await response.text()

    const parsedData = await parser.parseStringPromise(xml)
    let all_options = parsedData.result.option_activity[0].item

    all_options = formatData(all_options)

    return all_options;
  }

  addNewOptions(options) {
    /**
     * Only add new options to the this.data field. 
     */
    this.new_options = []
    if (this.lastOptionID != null) {
      for (let i = 0; i < options.length; i++) {
        let id = options[i].id

        if (id == this.lastOptionID) {
          break
        }

        this.new_options.push(options[i])
      }
    } else {
      this.new_options = options
    }

    this.lastOptionID = new_options[0].id
  }

  async pushNewOptions() {
    /**
     * Push the contents of new_options + backlog to the database.
     * If this function errors, then the backlog is updated to include the contents of new_options.
     * 
     * This function does nothing if new_option is empty (even if backlog isn't)
     */
    if (this.new_options.length > 0) {
      this.allData.unshift(...this.new_options)

      try {
        this.new_options.unshift(...this.backlog)
  
        //Push new options
        await saveOptions(this.new_options)
  
        //If we are successful, clear the backlog
        this.backlog = []
      } catch (e) {
        console.log(e)
  
        //If we error, add the items we wanted to push to the backlog
        //so it will be included next time
        this.backlog.unshift(...this.new_options)
      }
    }
  }

  trimData() {
    /**
     * Trim the beginning of the data array if it exceeds the limit set in the constructor
     */
    if (this.size() > this.sizeLimit) {
      let deleteCount = this.size() - this.limit;

      this.data.splice(0, deleteCount);
    }
  }

  getStats() {
    console.log(`Size of backlog ${this.size} size of data ${this.data.length}`)
  }
}

//Data
var options = new OptionCollection();

//Routine
setInterval(function () {
  options.update()
    .then(function () {
      let result = options.new_options;
      if (result) {
        console.log('Emitting event with ' + result.length + ' new results')
        io.emit('options', result)
      }
      console.log('All done')
    })
    .catch(error => console.error(error))
}, 5 * 1000)


//Handle new IO connection
io.on('connection', function (socket) {
  socket.emit('all_options', options.data)
})
