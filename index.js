const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')

let wodNum = 444
let scrapeLocation = `http://www.yancycamp.com/allison-tai/yancy-camp-workout-${wodNum}/`
let content = ''

const options = {
  uri: scrapeLocation,
  transform: function (body) {
    return cheerio.load(body)
  },
  headers: {'content-type': 'application/x-www-form-urlencoded'},
  body: 'login_user_name=USERNAME&login_pwd=PASSWORD&Submit=doLogin'
}

rp.post(options)
  .then(($) => {
    const workoutName = $('div .enigma_fuul_blog_detail_padding').children('h2').children('a').text()
    const message = $('div .enigma_fuul_blog_detail_padding').children('p').text()
    const searching = `Workout ${wodNum}`
    let endOfIntro = 0
    if (message.match(searching)) {
      endOfIntro = message.indexOf(searching)
    } else if (message.indexOf('Phase 1')) {
      endOfIntro = message.indexOf('Phase 1')
    }
    const introText = message.slice(0, endOfIntro)
    const workoutDesc = message.slice(endOfIntro)
    content += workoutName + '\n\n' + introText + '\n\n' + workoutDesc + '\n\n'
    createCsv()
  })
  .catch(err => {
    console.error(err)
  })

const createCsv = () => {
  fs.writeFileSync('list.text', content, 'utf8')
}
