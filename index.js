const Logging = require('./logging')
const log = new Logging('index')

const csv = require('csvtojson')

const csvFile = process.env.CSVFILE
const url = process.env.URL
if (!url) {
    throw new Error('Specify URL using environment variable. Example: URL="https://www.google.be/some/path"')
}
if (!csvFile) {
    throw new Error('Specify CSVFILE using environment variable. Example: CSVFILE="./some-exported-cloudlet-ruleset.csv"')
}
log.info("Checking CloudLets rules based on exported rules: " + csvFile + " against url: " + url)

csv({
    ignoreEmpty: true
})
    .preRawData((csvRawData)=>{
        // Remove comments from CSV file
        var newData=csvRawData.replace(/^\#.*$/gm,'');
        return newData;
    })
    .fromFile(csvFile)
    .then((jsonObj)=>{
        /*
            Example: 

        { ruleName: 'Some fancy rule name',
        matchURL?: '',
        scheme?: '',
        host?: 'www.example.com',
        path?: '',
        regex?: '/(en|fr|nl)/some/webpage',
        result:
        { useIncomingQueryString: '',
            useIncomingSchemeAndHost: '',
            useRelativeUrl: '',
            redirectURL: '/\\1/some-other/webpage',
            statusCode: '302' } }
        */
        let foundmultiplematches = false
        jsonObj.map(rule => {
            let match = true
            if (rule.scheme) {
                match = match && rule.scheme.split(' ').find(scheme => {
                    let resultOnPath = RegExp('^(' + scheme + '):').exec(url)
                    if (resultOnPath) {
                        log.debug("Match found on scheme for rule: ", rule)
                        return true
                    }
                    return false
                })
            }
            if (rule.host) {
                match = match && rule.host.split(' ').find(host => {
                    let resultOnPath = RegExp('^https?:\/\/' + host + '(/|$)').exec(url)
                    if (resultOnPath) {
                        log.debug("Match found on scheme for rule: ", rule)
                        return true
                    }
                    return false
                })
            }
            if (rule.matchURL && !RegExp('^' + rule.matchURL).exec(url)) {
                log.debug("Match failed on matchURL for rule: ", rule)
                match = false
            }
            if (rule.path) {
                match = match && rule.path.split(' ').find(path => {
                    let resultOnPath = RegExp(path).exec(url)
                    if (resultOnPath) {
                        log.debug("Match found on path for rule: ", rule)
                        return true
                    }
                    return false
                })
            }
            let resultOnRegex = RegExp(rule.regex).exec(url)
            if (rule.regex && !resultOnRegex) {
                log.debug("Match failed on regex for rule: ", rule)
                match = false
            }

            if (match) {
                foundmultiplematches ? log.error("Another match was already found, following match will be ignored: ", rule) : log.info("Match found for: ", rule)
                foundmultiplematches = true
            }
        })
})

 