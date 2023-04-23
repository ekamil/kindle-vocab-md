const path = require('path');
const fs = require('fs');

module.exports = {
    process(sourceText, sourcePath, options) {
        var file = fs.readFileSync(sourcePath, {
            encoding: "utf-8", flag: "r"
        })
        return {
            code: `module.exports = ${JSON.stringify(file)} ;`,
        }
    }
};