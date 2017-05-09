var request = require('request');
var cheerio = require('cheerio');
const nationalCode = {
  USD: 'america',
  JPY: 'japan',
  EUR: 'euro',
  CNY: 'china',
  KRW: 'korea',
  SGD: 'singapore',
  AUD: 'australia',
  HKD: 'hong-kong',
  CHF: 'swiss',
  CAD: 'canada',
  MYR: 'malaysia',
  GBP: 'england',
  SEK: 'sweden',
  NZD: 'new-zealand',
  THB: 'thailand',
  IDR: 'indonesia',
  ZAR: 'south-africa'
}

function getExchangeRate(rateCode){
  return new Promise(function(resolve, reject){
    let rateResult = {};
    request({
      url: 'http://rate.bot.com.tw/xrt?Lang=zh-TW',
      method: 'GET'
    }, function(error, response, body){
      if (error || !body) return;
      else {
        if (nationalCode[rateCode] === undefined) reject('no match');
        let $ = cheerio.load(body);
        let elementName = 'div.sp-' + nationalCode[rateCode] + '-div';
        rateResult.rateSight = $(elementName).parents('tr').find('td.rate-content-sight').last().text();
        rateResult.rateCash = $(elementName).parents('tr').find('td.rate-content-cash').last().text();
        resolve(rateResult);
      }
    }
  );
    // reject(rateResult);
  });
}

module.exports = getExchangeRate;
