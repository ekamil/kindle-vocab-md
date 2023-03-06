import { program } from "./cli";
import { testSelect } from "./select";

program.parse();
const options = program.opts();
console.log(options);

testSelect();
