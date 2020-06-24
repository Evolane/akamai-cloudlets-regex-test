const csv = require('csvtojson')

const csvFilePath = process.env.CSVFILE
const url = process.env.URL
if (!url) {
    throw new Error('Specify URL using environment variable. Example: URL="https://www.google.be/some/path"')
}
if (!csvFilePath) {
    throw new Error('Specify CSVFILE using environment variable. Example: CSVFILE="./some-exported-cloudlet-ruleset.csv"')
}
console.log("Checking regexes from file: " + csvFilePath + " against url: " + url)

csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{

/*
    Example: 

{ ruleName: 'Some fancy rule name',
  matchURL: '',
  scheme: '',
  host: 'www.example.com',
  path: '',
  regex: '/(en|fr|nl)/some/webpage',
  result:
   { useIncomingQueryString: '',
     useIncomingSchemeAndHost: '',
     useRelativeUrl: '',
     redirectURL: '/\\1/some-other/webpage',
     statusCode: '302' } }
*/
    jsonObj.map(x => {
        let paths = x.path.split(' ')
        paths.map(y => {
            let regex1 = RegExp(y, '');
            let res = regex1.exec(url)
            if (res && res.index > 0) {
                console.log("Match found on: ")
                console.log(x)
            }
        })
        let regex2 = RegExp(x.regex, '');
        let res2 = regex2.exec(url)
        if (res2 && res2.index > 0) {
            console.log("Match found on: ")
            console.log(x)
        }
    })
})

 