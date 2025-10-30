const { readFileSync } = require('fs');

const readDataCsv = (filename) => {
    return readFileSync(filename, 'utf8')
        .split(/\r?\n/)
        .filter(line => line)         
        .slice(1)                     
        .map(elm => +elm.split(' ')[1]); 
}

module.exports = { readDataCsv };
