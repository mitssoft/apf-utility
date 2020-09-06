const json = require('./files.json');
const https = require('https');
const fs = require('fs');

exports.run = async function (arg) {
    console.log('Apfu arguments: ');
    console.log(arg);
    let result = await parseFile(arg);
    console.log("The result is: ");
    console.log(result);
    console.log('Apfu has executed Ok');
    return result;
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

async function parseFile(apfName) {
    return new Promise(async (resolveParseFile, rejectParseFile) => {
        console.log("Parsing apf: " + apfName);
        console.log("Searching the cache for file....");
        let path = './apfu-cache/' + apfName + '.apf';
        let apf;
        let r = [];
        if (fs.existsSync(path)) {
            console.log("Apf found");
            // fs.openSync(path);
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
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            console.log(line);
            if(line.startsWith('#*@!')) {
                line = line.substring(4);
                if(line == 'EOF') {
                    break;
                } else if (line.startsWith('=')) {
                    r.push(line);
                }
                console.log("Comment line: " + line);
            } else if(line != '') {
                r.push(line);
            }
        }
        console.log(r);
        resolveParseFile(r);
    });
}

// class Apfu {
//     run(arg) {
//         console.log('Apfu has executed Ok');
//         console.log('Apfu arguments: ');
//         console.log(arg);
//     }
// }

// export const apfu = new Apfu();