import { readFileSync } from 'fs';
const process = (sourceText, sourcePath, options) => {
    var file = readFileSync(sourcePath, {
        encoding: "utf-8", flag: "r"
    })
    return {
        code: `module.exports = ${JSON.stringify(file)} ;`,
    }
};

export default { process }