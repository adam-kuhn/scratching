const rp = require('request-promise')
const cheerio = require('cheerio')

const options = {
  uri: 'http://www.yancycamp.com/allison-tai/yancy-camp-workout-468/',
  transform: function (body) {
    return cheerio.load(body)
  },
  headers: {'content-type': 'application/x-www-form-urlencoded'},
  body: 'login_user_name=YOURUSERNAME&login_pwd=aYOURPASSWORD&Submit=doLogin'
}

rp.post(options)
  .then(($) => {
    let x = $('p').text()
    console.log(x)
  })
  .catch(err => {
    console.error(err)
  })
