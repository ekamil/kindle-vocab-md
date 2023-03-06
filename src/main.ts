import { program } from "./cli";
import { testRender } from "./render";
import { testSelect } from "./select";

program.parse();
const options = program.opts();
console.log(options);

testRender();
testSelect();