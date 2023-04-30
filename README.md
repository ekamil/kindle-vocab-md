# Export kindle vocabulary to Markdown

Set of tools to liberate your "Vocabulary Builder" highlights from Kindle.

## Mission statement

> As an Obsidian user I want to browse, connect and use my Kindle highlights seamlessly.

## Features

- grabs all words and books from your Kindle vocabulary database
- creates WikiLinks between from words to books
- safe to run repeatedly in the same directory (🤞🏽)

## Issues & next steps

See [issues](https://github.com/ekamil/kindle-vocab-md/issues)

⚠️ Unknown how it works with multiple languages and other versions of Kindle. ⚠️

## Details

To achieve the mission statement I need 3 components:

1. API part interfacing with Kindle `vocab.db` and returning some usable data structure
2. CLI part to easily use and test the solution
3. (planned) Obsidian plugin

### Development

Using `lerna` to manage all elements.

#### Publish

`lerna publish` or `npm run version && npm run publish`

### Tools

[Lerna](https://lerna.js.org/)
[Nunjucks](https://mozilla.github.io/nunjucks/templating.html)
[Gray Matter](https://www.npmjs.com/package/gray-matter)

Maybe:
[chalk for richer TUI](https://github.com/chalk/chalk)
