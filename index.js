const csv = require('csvtojson')

const csvFile = process.env.CSVFILE
const url = process.env.URL
if (!url) {
    throw new Error('Specify URL using environment variable. Example: URL="https://www.google.be/some/path"')
}
if (!csvFile) {
    throw new Error('Specify CSVFILE using environment variable. Example: CSVFILE="./some-exported-cloudlet-ruleset.csv"')
}
console.log("Checking CloudLets rules based on exported rules: " + csvFile + " against url: " + url)

csv()
    .fromFile(csvFile)
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

        jsonObj.map(rule => {
            let paths = rule.path.split(' ')
            paths.map(path => {
                let resultOnPath = RegExp(path).exec(url)
                if (resultOnPath && resultOnPath.index > 0) {
                    console.log("Match found on path for rule: ", rule)
                }
            })
            let resultOnRegex = RegExp(rule.regex).exec(url)
            if (resultOnRegex && resultOnRegex.index > 0) {
                console.log("Match found on regex for rule: ", rule)
            }
        })
})

 