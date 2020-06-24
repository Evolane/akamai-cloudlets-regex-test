# Akamai CloudLets Regex Tester

## Install

Just run "npm install" to retrieve the "csvtojson" dependency. That's it
* npm install
You also need NodeJS installed. If you dont have it, you can always use brew to install it.
* brew install node

## Run

You just need to specify URL and CSVFILE using environment variables. So you can either set them or use it as a one line command like:

URL="https://www.google.be/some/path" CSVFILE="./some-cloudlets-exported-file.csv" node index.js
