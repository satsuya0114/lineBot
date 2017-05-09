var config = require('./config');
var linebot = require('linebot');
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var wit = require('./witHandle.js');
var getExchageRate = require('./exchangeRate.js');
var userId = [];
var jpyLowRate = '0.273';
var oneMinute = 60000;

const bot = new linebot({
  channelId: config.channelId,
  channelSecret: config.channelSecret,
  channelAccessToken: config.channelAccessToken
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//express default : 3000  heroku : 8080
var server = app.listen(process.env.PORT || 3000, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});

noticeJPYRate();
setInterval(noticeJPYRate, oneMinute * 2);

bot.on('message', getMessage);

bot.on('follow', function(event){
  userId.push(event.source.userId);
})

bot.on('unfollow', function(event){
  var index = userId.indexOf(event.source.userId);
  if( index > -1){
    userId.splice(index, 1);  // delete unfollow userId from array
  }
})

function noticeJPYRate(){
  console.log('noticeJPYRate run!');
  if (userId.length !== 0){
    getExchageRate('JPY').then(function(rateResult){
      if (rateResult.rateSight < jpyLowRate) {
        let tempText = '日幣低於' + jpyLowRate + '惹!!! 可以買了 Ｏ(≧▽≦)Ｏ ﾜｰｲ♪';
        bot.multicast(userId, tempText + '\n即期賣出: ' + rateResult.rateSight + '\n現金賣出: ' + rateResult.rateCash)
      }
    }).catch((error) => {
      bot.multicast(userId, '出錯了Q_Q 請你馬上跟捏捏連絡');
    })
  }
}

function getMessage(e){
  console.log(e);
  console.log('conversation userId:' + userId);
  if (e.source.userId && userId.indexOf(e.source.userId) === -1){
    console.log('get userId');
    userId.push(e.source.userId);
  }
  // if (e.source.groupId && userId.indexOf(e.source.groupId) === -1){
  //   console.log('get groupId');
  //   userId.push(e.source.groupId);
  // }
  if (e.message.type !== 'text') return ;
  let msg = e.message.text;
  const askTimeReg = /\s*\S*(現在)+\s*\S*(時間|幾點)+\s*\S*/g;
  if (msg.match(askTimeReg)) {
    let now = moment.utc().add(8, 'hours');
    e.reply('現在是 ' + now.format('HH:mm') + ' (*ﾟ▽ﾟ)ﾉ~ ').then(function(){}).catch(function(){});
    return;
  }
  const askRate = /\s*\S*(匯率)+\s*\S*/g;
  if (msg.match(askRate)) {
    wit(msg).then(function(entities){
      console.log('entities.exchangeRate:' + entities.exchangeRate);
      if (entities.exchangeRate){
        getExchageRate(entities.exchangeRate).then(function(rateResult){
          let tempText = '[ 幣別: ' + entities.exchangeRate + ' ]';
          e.reply(tempText + '\n即期賣出: ' + rateResult.rateSight + '\n現金賣出: ' + rateResult.rateCash);
        }).catch((error) => {
          e.reply('我不知道' + entities.exchangeRate + ' 能吃嗎 0.0?');
        })
      } else {
        e.reply('我看不懂你在說什麼O__O');
      }
      //logic and some else function
    }).catch((error) => console.log(error));
    // e.replay(replyObj);
    return;
  }
}
