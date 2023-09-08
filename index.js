const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const {google} = require('googleapis');
const cors = require("cors");

const bodyParser = require('body-parser')
require('dotenv').config();
// const backOff = require("exponential-backoff");
// const { createProxyMiddleware } = require('http-proxy-middleware')


const app = express();

app.use(cors({
  origin: ['https://calendar-automater-production.up.railway.app', 'http://localhost:3000', 'http://calendar-automater-production.up.railway.app'],
  credentials : true
}));

// app.options('*', cors());

// const corsOptions = {
//   origin: [
//     'http://localhost:3000',
//     'https://calendar-automater-production.up.railway.app'
//   ]
// };

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));
// app.use(express.static(path.join(__dirname, 'client/build')));


//Proxy
// app.use(
//   '/api',
//   createProxyMiddleware({
//     target: 'calendar-automater-api-production.up.railway.app',
//     changeOrigin: true,
//   }),
// )

//Pupeteer Scraper

app.post('/api/getList', bodyParser.json(), function(req, res) {

    const buildingAbbreviations = {
        "AAS": "Boston University African American Studies, 138 Mountfort St, Brookline, MA 02446",
        "AGG": "Agganis Arena, 925 Commonwealth Ave, Boston, MA 02215",
        "ASC": "Elliot Cole Academic Support Center, 300 Ashford St, Boston, MA 02134",
        "BRB": "Boston University Biology Research Building, 5 Cummington Mall, Boston, MA 02215",
        "BSC": "Boston University Biological Science Center, 2 Cummington Mall, Boston, MA 02215",
        "CAS": "College of Arts and Sciences, 685–725 Commonwealth Ave, Boston, MA 02215",
        "CDS": "BU Faculty of Computing & Data Sciences, 645-665 Commonwealth Avenue, Boston, MA 02215",
        "CFA": "College of Fine Arts, 855 Commonwealth Ave, Boston, MA 02215",
        "CGS": "College of General Studies, 871 Commonwealth Ave, Boston, MA 02215",
        "CNS": "Boston University Cognitive and Neural Systems Department, 677 Beacon St, Boston, MA 02215",
        "COM": "College of Communication, 640 Commonwealth Ave, Boston, MA 02215",
        "CRW": "Boston University DeWolfe Boathouse, 619 Memorial Dr, Cambridge, MA 02139",
        "CSE": "285 Babcock St, Boston, MA 02215",
        "EGL": "English Faculty Offices, 236 Bay State Road, Boston, MA 02215",
        "EIB": "BU Editorial Institute, 143 Bay State Rd, Boston, MA 02215",
        "EMA": "Boston University Engineering Manufacturing Annex, 730 Commonwealth Ave, Boston, MA 02215",
        "EMB": "Boston University Engineering Manufacturing Building, 15 St Mary's St, Brookline, MA 02446",
        "ENG": "College of Engineering, 110–112 Cummington Mall, Boston, MA 02215",
        "EOP": "Center for English Language, 890 Commonwealth Avenue, Boston, MA 02215",
        "EPC": "Engineering Product Innovation Center, 750 Commonwealth Ave, Brookline, MA 02446",
        "ERA": "Boston University Engineering Research Annex, 48 Cummington Mall, Boston, MA 02215",
        "ERB": "Boston University Engineering Research Building, 48 Cummington Mall, Boston, MA 02215",
        "FAB": "BU Fenway Activities Building, 180 Riverway, Boston, MA 02215",
        "FCB": "Fenway Classroom Building, 25 Pilgrim Rd, Boston, MA 02215",
        "FCC": "Campus Center & Student Residence, 150 Riverway, Boston, MA 02215",
        "FLR": "Boston University Peter Fuller Building, 808 Commonwealth Ave, Brookline, MA 02446",
        "GMS": "Faculty Office Building (Alden Hall), 704 Commonwealth Avenue, Boston, MA 02215",
        "GRS": "Graduate School of Arts and Sciences, 705 Commonwealth Ave, Boston, MA 02215",
        "GSU": "George Sherman Union, 775 Commonwealth Ave, Boston, MA 02215",
        "HAR": "Boston University Rafik B. Hariri Building, 595 Commonwealth Ave, Boston, MA 02215",
        "HAW": "Hawes Building, 43 Hawes Street, Brookline, MA 02446",
        "HIS": "History and American Studies Departments, 226 Bay State Rd, Boston, MA 02215",
        "IEC": "Boston University International Programs, 888 Commonwealth Ave, Boston, MA 02215",
        "IRB": "International Relations Building, 154 Bay State Rd, Boston, MA 02215",
        "IRC": "International Relations Center, 152 Bay State Road, Boston, MA 02215",
        "JSC": "Elie Wiesel Center for Jewish Studies, 147 Bay State Road, Boston, MA 02215",
        "KCB": "Boston University Kenmore Classroom Building, 565 Commonwealth Ave, Boston, MA 02215",
        "KHC": "Kilachand Honors College, 91 Bay State Rd # 115, Boston, MA 02215",
        "LAW": "Boston University School of Law, 765 Commonwealth Ave, Boston, MA 02215",
        "LEV": "Boston University Alan and Sherry Leventhal Center, 233 Bay State Rd, Boston, MA 02215",
        "LNG": "Romance Studies/Modern Foreign Languages, 718 Commonwealth Avenue, Boston, MA 02215",
        "LSE": "Boston University Life Science and Engineering Building, 24 Cummington Mall, Boston, MA 02215",
        "MCH": "Boston University Marsh Chapel, 735 Commonwealth Ave, Boston, MA 02215",
        "MCS": "Boston University Math and Computer Science, 111 Cummington Mall, Boston, MA 02215",
        "MED": "Boston University School of Public Health, 715 Albany Street, Boston, MA 02118",
        "MET": "Boston University Metropolitan College, 1010 Commonwealth Ave, Boston, MA 02215",
        "MOR": "Alfred L. Morse Auditorium, 602 Commonwealth Ave, Boston, MA 02215",
        "MUG": "Mugar Memorial Library, Gotlieb Archival Research Center, 771 Commonwealth Ave, Boston, MA 02215",
        "PDP": "Physical Development Program, 915 Commonwealth Avenue, Boston, MA 02215",
        "PHO": "Boston University Photonics Building, 6-8 St Mary's St, Boston, MA 02215",
        "PLS": "Anthropology, Philosophy, Political Science, 232 Bay State Road, Boston, MA 02215",
        "PRB": "Boston University Physics Research Building, 3 Cummington Mall, Boston, MA 02215",
        "PSY": "Department of Psychological and Brain Sciences, 64–72–86 Cummington Mall # 149, Boston, MA 02215",
        "PTH": "Boston Playwrights' Theatre, 949 Commonwealth Ave, Boston, MA 02215",
        "REL": "CAS Religion, 145 Bay State Road, Boston, MA 02215",
        "RKC": "Rajen Kilachand Center for Integrated Life Sciences & Engineering, 610 Commonwealth Ave, Boston, MA 02215",
        "SAC": "Sargent Activities Office, 1 University Road, MA 02215",
        "SAL": "Boston University Sailing Pavilion, Dr Paul Dudley White Bike Path, Boston, MA 02215",
        "SAR": "Sargent College of Health and Rehabilitation Sciences, 635 Commonwealth Ave, Boston, MA 02215",
        "SCI": "Metcalf Center for Science and Engineering, 590-596 Commonwealth Avenue, MA 02215",
        "SDM": "Henry M. Goldman School of Dental Medicine, 100 East Newton Street, Boston, MA 02118",
        "SHA": "Boston University School of Hospitality Administration, 928 Commonwealth Ave, Boston, MA 02215",
        "SLB": "Science and Engineering Library, 30–38 Cummington Mall, MA 02215",
        "SOC": "Department of Sociology, 96-100 Cummington Mall # 260, Boston, MA 02215",
        "SPH": "Boston University School of Public Health, 715 Albany St, Boston, MA 02118",
        "SSW": "School of Social Work, 264-270 Bay State Rd, Boston, MA 02215",
        "STH": "School of Theology, 745 Commonwealth Ave, Boston, MA 02215",
        "STO": "Stone Science Building, 675 Commonwealth Ave, Boston, MA 02215",
        "THA": "Joan & Edgar Booth Theatre and College of Fine Arts Production Center, 820 Commonwealth Ave, Brookline, MA 02446",
        "TTC": "Boston University Track & Tennis Center, 100 Ashford St, Boston, MA 02215",
        "WEA": "Wheelock College of Education & Human Development Annex, 621 Commonwealth Avenue, Boston, MA 02215",
        "WED": "Wheelock College of Education & Human Development, 2 Silber Way, Boston, MA 02215",
        "YAW": "Boston University Yawkey Center for Student Services, 100 Bay State Rd, Boston, MA 02215"
    };
    
    function getNextDayOfWeek(date, dayOfWeek, time) {
        // Code to check that date and dayOfWeek are valid left as an exercise ;)
        var resultDate = new Date(date.getTime());
        resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
    
        //Convert time to 24 hours
        let timeAbbrv = time.slice(time.length-2, time.length);
        time = time.slice(0, time.length-2);
        let [hours, minutes] = time.split(':');
    
        if (timeAbbrv == 'am') {
          if (hours == '12') {
            hours = '00';
          }
          else if (parseInt(hours) < 10){
            hours == '0' + hours
          }
        }
        else if (timeAbbrv == 'pm' && hours != '12') {
          hours = String(parseInt(hours) + 12);
        }
    
        return `${resultDate.toISOString().split('T')[0]}T${hours}:${minutes}:00`;
    }

    function autoCorrect(text, correction) {
      const reg = new RegExp(Object.keys(correction).join("|"), "g");
      return text.replace(reg, (matched) => correction[matched]);
    }
    
    puppeteer.launch({headless: "new", args: ['--single-process', "--disable-setuid-sandbox", '--no-sandbox', '--no-zygote'], ignoreDefaultArgs: ['--disable-extensions']}).then(async function(browser) {
        const page = await browser.newPage();
    
        await page.goto("https://www.bu.edu/link/bin/uiscgi_studentlink.pl/1676256927?ModuleName=allsched.pl");
    
        await page.type("#j_username", req.body.username);
        await page.type("#j_password", req.body.password);
        await page.click('.input-submit');
    
        await page.waitForSelector('#dont-trust-browser-button');
        await page.click("#dont-trust-browser-button");
    
        // const data = await page.$$eval('table tbody tr td', tds => tds.map((td) => {
        //   return td.innerText;
        // }));
        await page.waitForSelector("table");
    
        const data = await page.evaluate(() => {
          const tables = document.querySelectorAll('table');
          const schedule = tables[tables.length - 1]
          const rows = schedule.querySelectorAll('tr');
          const temp = [...rows].splice(1,rows.length);
          const classInfo = temp.map((element) => {
            return Array.from(element.querySelectorAll('td'), innerElement => innerElement.innerText)
          })
    
          return classInfo;
        });
        var parcedData = [];
        // const semesterEndDate = "20231212T170000Z"
        const recurrence = ['RRULE:FREQ=WEEKLY;UNTIL='+req.body.endDate]
        data.forEach((item, i) => {
          var description = ""
          var offset = 0;
          if (i == 0) {
            offset = 1;
          }
          else {
            offset = 0;
          }

          //Skipping Arranged classes
          if (item[9+offset] == 'Arranged') {
            return;
          }

          //Adding notes to description
          const replacements = {
            "Class Closed": "",
            "Class Full": '',
            "\n": ' '
          }
      
          var notes = autoCorrect(item[12+offset], replacements).trim()
          
          var arr = item[4+offset].split('\n');
          if (item[5+offset] == '') {
            description = `${item[6+offset].split('\n')[0]} with ${arr[1]}\n${notes}`
          }
          else {
            description = `${item[5+offset]}\n${item[6+offset].split('\n')[0]} with ${arr[1]}\n${notes}`
          }
          var weekdays = item[9+offset].split('/n')[0].split(',');
          const weekdayToInt = {
            'Sun': 0,
            'Mon': 1,
            'Tue': 2,
            'Wed': 3,
            'Thu': 4,
            'Fri': 5,
            'Sat': 6
          };
          for (let j = 0; j < weekdays.length; j++) {
            var startDate = new Date(req.body.startDate);
            parcedData.push({
              'summary': item[0+offset] + ": " +arr[0],
              'description': description,
              'status': "confirmed",
              'location': item[8+offset] +', ' +buildingAbbreviations[item[7+offset]],
              'recurrence': recurrence,
              'start': {
                'dateTime': getNextDayOfWeek(startDate, weekdayToInt[weekdays[j]], item[10+offset]),
                'timeZone': 'America/New_York'
              },
              'end': {
                'dateTime': getNextDayOfWeek(startDate, weekdayToInt[weekdays[j]], item[11+offset]),
                'timeZone': 'America/New_York'
              },
            })
          }
        });
    
        console.log('sent');
    
        await browser.close()

        // Sending parcedData back to Postman
        res.send(parcedData);
    
    });
});

//Google Calendar Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

//Get Calendars list
app.post('/api/getCalendars', bodyParser.json(), async (req, res) => {

  oauth2Client.setCredentials({access_token: req.body.access_token});
  
  const calendar = google.calendar({version: 'v3', auth: oauth2Client});
  
  const calendarList = await calendar.calendarList.list({'minAccessRole': 'writer'});

  var calendarNamesArray = {};
    for (let i = 0; i < Object.keys(calendarList.data.items).length; i++) {
        calendarNamesArray[calendarList.data.items[i].summary] = calendarList.data.items[i].id;
    }
  res.send(calendarNamesArray);
});

app.post('/api/insertEvents', bodyParser.json(), async (req, res) => {

  console.log(oauth2Client);

  const calendar = google.calendar({version: 'v3', auth: oauth2Client});

  // const backoff = (fun, exponent, index)  => {
  //   console.log('Retrying after ' + Math.pow(2, exponent))
  //   setTimeout(async () => {
  //     const res = await fun(index)
  //     if (res.data) {
  //         console.log('success')
  //         return 1
  //     } else if (exponent <= 10) {
  //         backoff(fun, exponent + 1, index)
  //     } else {
  //         console.log('failure')
  //         }
  //     }, Math.pow(2, exponent) + Math.random() * 1000)
  // }

  // function insertEvent(index) {
  //   return calendar.events.insert({
  //     'calendarId': req.body.chosenCalendarId,
  //     'resource': req.body.events[index],
  //     'sendNotifications': true
  //   })
  // }

  for (let i = 0; i < Object.keys(req.body.events).length; i++) {
    //backoff(insertEvent, 0, i)
    const test = await calendar.events.insert({
      'calendarId': req.body.chosenCalendarId,
      'resource': req.body.events[i],
      'sendNotifications': true
    })
    console.log(`${i} success`)
  }

    
  res.send("Success")
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/build/index.html'));
});

const port = process.env.PORT || 4000;
app.listen(port, "0.0.0.0", function () {
  // ...
});

console.log('App is listening on port ' + port);

