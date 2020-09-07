const json = require('./files.json');
const https = require('https');
const fs = require('fs');

exports.run = async function (arg, subset) {
    console.log('Apfu command: ');
    console.log(arg);
    let result = await parseFile(arg, subset);
    console.log("The result is: ");
    console.log(result);
    console.log('Apfu has executed Ok');
    return result;
}

async function parseFile(apfName, _subset) {
    return new Promise(async (resolveParseFile, rejectParseFile) => {
        let subset = _subset;
        let subsetted = false;
        if (subset != undefined && Array.isArray(subset)) {
            subsetted = true;
        }
        try {
            subset = orderArray(subset);
        } catch (error) {
            return error;
        }

        console.log("Parsing apf: " + apfName);
        console.log("Searching the cache for file....");
        let path = './apfu-cache/' + apfName + '.apf';
        let apf;
        let r = [];
        if (fs.existsSync(path)) {
            console.log("Apf found");
            apf = fs.readFileSync(path);
            // console.log(apf.toString());
            console.log("Apf read");
        } else {
            console.log("Apf not found");
            let path = await import_apf(apfName);
            apf = fs.readFileSync(path);
            // console.log(apf.toString());
            console.log("Apf imported and read");
        }
        let apft = apf.toString();
        let lines = apft.split(/\r\n|\r|\n/);
        let j = 0;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            // console.log(line);
            if (line.startsWith('#*@!')) {
                line = line.substring(4);
                if (line == 'EOF') {
                    break;
                } else if (line.startsWith('=')) {
                    j++;
                    if (subsetted == true && subset[0] == j) {
                        r.push(line);
                        subset.shift();
                        console.log(r.length + ' ' + line);
                        
                        
                    } else if(subsetted == false) {
                        r.push(line);
                        console.log(r.length + ' ' + line);
                    }                    
                }
                // console.log("Comment line: " + line);
            } else if (line != '') {
                j++;
                if (subsetted == true && subset[0] == j) {
                    r.push(line);
                    subset.shift();
                    console.log(r.length + ' ' + line);
                    
                    
                } else if(subsetted == false) {
                    r.push(line);
                    console.log(r.length + ' ' + line);
                    
                }
                
            }
        }
        console.log(r);
        resolveParseFile(r);
    });
}

function orderArray(array) {
    if (!Array.isArray(array)) {
        return new Error('orderArray: Not an array');
    }
    array = array.sort((a, b) => a - b);
    return array; 

}

const import_apf = async function (lang) {
    return new Promise((resolveImport, rejectImport) => {
        console.log("Language: " + lang);
        if (!fs.existsSync("./apfu-cache/")) {
            fs.mkdirSync("./apfu-cache/", { recursive: true });
        }
        let fileName = json[lang]["file-name"]
        let path = "./apfu-cache/" + fileName;
        if (!fs.existsSync(path)) {
            let url = json[lang]["file-url"];
            console.log('Fetching: ' + url);
            const file = fs.createWriteStream(path);
            const request = https.get(url, function (response) {
                let piping = response.pipe(file);
                piping.on('finish', () => {
                    resolveImport(path);
                })
            });

        } else {
            console.log(fileName + " already exists in cache");
        }
    });
}

exports.import_apf = import_apf;
