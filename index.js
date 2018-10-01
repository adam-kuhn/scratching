const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')
const PDFDocument = require('pdfkit')

const doc = new PDFDocument({autoFirstPage: false})
doc.pipe(fs.createWriteStream('ouput.pdf'))

let content = ''
let scrapedData = []
const firstWorkout = 500
const lastWorkout = 503

const printFiles = (pdfObj, string) => {
  fs.writeFileSync('list.text', string, 'utf8')
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

const makeCalls = (first, last, total, next) => {
  const workoutNum = next || first
  let count = total || 0
  const pages = last - first
  const scrapeLocation = `http://www.yancycamp.com/allison-tai/yancy-camp-workout-${workoutNum}/`
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

makeCalls(firstWorkout, lastWorkout)
