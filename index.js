const rp = require('request-promise')
const cheerio = require('cheerio')

const options = {
  uri: 'url to scrape',
  transform: function (body) {
    return cheerio.load(body)
  }
}

rp(options)
  .then(data => {
  // do something
  })
  .catch(err => {
    console.error(err)
  })
