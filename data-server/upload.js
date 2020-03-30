const fetch = require('node-fetch');

const endpoint = process.env.ENDPOINT
const query = `mutation CreateMessage($input: [OptionData]) {
    saveOption(options: $input) {
    id
  }
}`;

module.exports.saveOptions = async (options) => {
    options = options.map(o => {
        delete o.id;
        return o;
    });

    const queryBody = JSON.stringify({
        query: query,
        variables: {
            input: options
        }
    });
  
    const response = await fetch(endpoint, {
      headers: {'content-type': 'application/json'},
      method: 'POST',
      body: queryBody,
    });
    
    const responseJson = await response.text();

    if (response.status != 200) {
        throw new Error('Got invalid response ' + responseJson);
    }

    return responseJson;
};