import { program } from "./cli";

program.parse();
const options = program.opts();
console.log(options);
