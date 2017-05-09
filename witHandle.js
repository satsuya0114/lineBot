'use strict';

const {Wit, log} = require('node-wit');

// generate wit bot
const witBot = new Wit({
  accessToken: 'KG76OWNHW6ECTL5UUDXLU4B6I6FFN7P3',
  logger: new log.Logger(log.DEBUG), // optional
});

function getIntent(messageText) {
  return new Promise(function(resolve, reject){
    witBot.message(messageText, {})
    .then((data) => {
      console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
      console.log('result in msg:' + data.msg_id);
      const entities = {};
      Object.keys(data.entities).forEach((entityKey) => {
        entities[entityKey] = data.entities[entityKey][0].value;
      });
      resolve(entities); // callback
      // callBack(data);
    })
    .catch(console.error);
  })
}

//----- user async/ await function  (node 7.0 up support only)
// async function getIntent(messageText) {
//   const result = await witBot.message(messageText);
//   const entities = {};
//   Object.keys(result.entities).forEach((entityKey) => {
//     entities[entityKey] = result.entities[entityKey][0].value;
//   });
//   const newResult = { ...result, entities };
//   if (!newResult.entities.intent) {
//     newResult.entities.intent = 'None';
//   }
//   return newResult;
// }

module.exports = getIntent;

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
      if (context.greeting){
        console.log('greeting');
      }
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
