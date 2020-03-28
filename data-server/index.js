const xml2js = require('xml2js');
const fetch = require('node-fetch');
const date = require('date-and-time');
const io = require('socket.io')(8080);

//Date Config
const parser = new xml2js.Parser(/* options */);
const date_pattern = date.compile('YYYY-MM-DD HH:mm:ss');

//API Config
const API = 'https://api.benzinga.com/api/v1/signal/option_activity?apiKey=3085d152a4124662836f7f0d963672ca&token=3085d152a4124662836f7f0d963672ca';


//Data
var lastOptionID = null;
var allData = [];

var lastResetTime = (new Date());


function formatData(data) {
    data = data.map(e => {
        const keys = Object.keys(e);

        for (let i = 0; i < keys.length; i++) {
            e[keys[i]] = e[keys[i]][0];
        }

        return e;
    });

    data = data.map(e => {
        const keys = Object.keys(e);

        for (let i = 0; i < keys.length; i++) {
            switch (keys[i]) {
                case 'date': {
                    const parsedDate = date.parse(e['date'] + ' ' + e['time'], date_pattern);
                    e['date'] = parsedDate;
                    break;
                }
                default:
                    break;
            }
        }

        return e;
    });

    return data;
}

async function fetchLatest() {
    let now = new Date();

    if (now.getHours() == 9 && (now - lastResetTime) / 1000 / 60 / 60 > 23) {
        lastResetTime = now;

        allData = []; //Clear options

        io.emit('clear'); //Tell connected clients to clear
    }

    console.log("Checking for updates..");
    const response = await fetch(API);
    const xml = await response.text();

    const parsedData = await parser.parseStringPromise(xml);

    let all_options = parsedData.result.option_activity[0].item;

    all_options = formatData(all_options);

    console.log("Got " + all_options.length + " options");

    let new_options = [];
    if (lastOptionID != null) {
        for (let i = 0; i < all_options.length; i++) {
            let id = all_options[i].id;

            if (id == lastOptionID) {
                break;
            }

            new_options.push(all_options[i]);
        }
    } else {
        new_options = all_options;
    }

    console.log("Got " + new_options.length + " new options");

    if (new_options.length == 0) {
        return false;
    } else {
        lastOptionID = new_options[0].id;

        allData.unshift(...new_options);

        //TODO Store old elements (last N) in a database (Mongo? Elasticsearch?)
        /*if (allData.length > N) {
            let oldElements = allData[:N];

            pushToDatabase(oldElements);

            allData.remove(oldElements);
        }*/

        return new_options;
    }
}

setInterval(function() {
    fetchLatest().then(function(result) {
        if (result) {
            console.log("Emitting event with " + result.length + " new results");
            io.emit('options', result);
        }
        console.log("All done");
    })
}, 5*1000);

io.on('connection', function(socket) {
    socket.emit('all_options', allData);
});