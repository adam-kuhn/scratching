const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')
const PDFDocument = require('pdfkit')

const doc = new PDFDocument({autoFirstPage: false})
doc.pipe(fs.createWriteStream('yancy-camp.pdf'))

let content = ''
let scrapedData = []
// enter the first workout you would like to download -> currently there are no workouts below 179 on the yancy camp website
const firstWorkout = 179
// enter the last workout you would like to download
const lastWorkout = 527

const makeCalls = (first, last, total, next) => {
  const workoutNum = next || first
  let count = total || 0
  const pages = last - first
  // replace athleteFirst-athleteLast with the first and last names of your membership
  // for example allison-tai or rea-kolbl
  const scrapeLocation = workoutNum === 204 ? 'http://www.yancycamp.com/athleteFirst-athleteLast/ocr-trial-results-and-yancy-camp-scoreboards/'
    : `http://www.yancycamp.com/athleteFirst-athleteLast/yancy-camp-workout-${workoutNum}/`
  const options = {
    uri: scrapeLocation,
    transform: function (body) {
      return cheerio.load(body)
    },
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    // replace USERNAME with your username
    // replace PASSWORD with your password -> you may have to change your password to have no special characters
    body: 'login_user_name=USERNAME&login_pwd=PASSWORD&Submit=doLogin'
  }
  rp.post(options)
    .then(($) => {
      const workoutName = $('div .enigma_fuul_blog_detail_padding').children('h2').children('a').text()
      const message = $('div .enigma_fuul_blog_detail_padding').children('p').text()
      const searching = `Workout ${workoutNum}`
      let endOfIntro = 0
      if (message.match(searching)) {
        endOfIntro = message.indexOf(searching)
      } else if (message.indexOf('Phase 1')) {
        endOfIntro = message.indexOf('Phase 1')
      }
      const introText = message.slice(0, endOfIntro)
      const workoutDesc = message.slice(endOfIntro)
      const scrapedWorkout = {
        workoutName,
        introText,
        workoutDesc
      }
      scrapedData.push(scrapedWorkout)
      content += workoutName + '\n\n' + introText + '\n\n' + workoutDesc + '\n\n'
      const nextWorkout = workoutNum + 1
      count++
      if (count === pages + 1) {
        printFiles(scrapedData, content)
      } else {
        makeCalls(first, last, count, nextWorkout)
      }
    })
    .catch(err => {
      console.error(err)
    })
}

const printFiles = (pdfObj, string) => {
  fs.writeFile('yancy-camp.text', string, 'utf8')
  for (let j = 0; j < pdfObj.length; j++) {
    doc.addPage()
      .fontSize(18)
      .text(pdfObj[j].workoutName, {underline: true})
      .moveDown()
      .fontSize(12)
      .fillColor('grey')
      .text(pdfObj[j].introText)
      .moveDown()
      .fillColor('black')
      .text(pdfObj[j].workoutDesc)
      .moveDown()
      .moveTo(doc.x, doc.y)
      .lineTo(doc.x + 400, doc.y)
      .stroke()
  }
  doc.end()
}

makeCalls(firstWorkout, lastWorkout)
