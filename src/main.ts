import { program } from "./cli";
import { testSelect } from "./select";
import { renderWordTemplate } from "./templates";

program.parse();
const options = program.opts();
console.log(options);

testSelect();
console.log(
  renderWordTemplate({
    word: "foo",
    usage: "Bar",
  }),
);
