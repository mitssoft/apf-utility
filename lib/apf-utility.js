const json = require('./files.json');
const https = require('https');
const fs = require('fs');

exports.run = function (arg) {
    console.log('Apfu has executed Ok');
    console.log('Apfu arguments: ');
    console.log(arg);
}

exports.import = function (lang) {
    console.log("Language: " + lang);
    if (!fs.existsSync("./apfu-cache/")) {
        fs.mkdirSync("./apfu-cache/", { recursive: true });
    }
    let fileName = json['jsdoc']["file-name"]
    let path = "./apfu-cache/" + fileName;
    if (!fs.existsSync(path)) {
        let url = json['jsdoc']["file-url"];
        console.log('Fetching: ' + url);
        const file = fs.createWriteStream(path);
        const request = https.get(url, function (response) {
            response.pipe(file);
        });
    } else {
        console.log(fileName + " already exists in cache");
    }

}

// class Apfu {
//     run(arg) {
//         console.log('Apfu has executed Ok');
//         console.log('Apfu arguments: ');
//         console.log(arg);
//     }
// }

// export const apfu = new Apfu();