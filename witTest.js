'use strict';

let Wit = null;
let interactive = null;
try {
  // if running from repo
  Wit = require('node_modules/node-wit').Wit;
  interactive = require('node_modules/node-wit').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

const accessToken = (() => {
  // console.log(process);
  // if (process.argv.length !== 3) {
  //   console.log('usage: node examples/quickstart.js <wit-access-token>');
  //   process.exit(1);
  // }
  return 'KG76OWNHW6ECTL5UUDXLU4B6I6FFN7P3';
})();

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

const firstEntityValue = (entities, entity) => {
  console.log('firstEnt');
  const val = entities && entities[entity] && Array.isArray(entities[entity]) && entities[entity].length > 0 && entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object'
    ? val.value
    : val;
};

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies, msg} = response;
    return new Promise(function(resolve, reject) {
      console.log(JSON.stringify(request));
      console.log(JSON.stringify(response));
      return resolve();
    });
  },
  getExchangeRate({context, entities}) {
    return new Promise(function(resolve, reject) {
      var search_query = firstEntityValue(entities, 'exchangeRate')
      if (search_query) {
        context.getExchangeRateResult = 'entities: ' + search_query; // we should call a real API here
        console.log(context.getExchangeRateResult);
      } else {
        console.log('miss entities');
        // To-do
      }
      return resolve(context);
    });
  }
};

const client = new Wit({accessToken, actions});
interactive(client);
