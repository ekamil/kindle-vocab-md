# Export kindle vocabulary to Markdown

This program (script) is a way to liberate your "Vocabulary Builder" highlights from Kindle.

There are alternatives but my goal here was to export in a way compatible with [Obsidian](https://obsidian.md/) - ie. into a directory of markdown files.

**Important: backup the output directory before running**

The script shouldn't delete anything, but better safe than sorry!

## Features

- grabs all words and books from your Kindle vocabulary database
- creates WikiLinks between from words to books
- safe to run repeatedly in the same directory (🤞🏽)

## Issues
#todo: link to GH issues

⚠️ Unknown how it works with multiple languages and other versions of Kindle. ⚠️

## Example output

```
📂 ./out
┣━━ 📂 books
┃   ┣━━ 📄 A Desolation Called Peace 2 Teixcalaan.md (212 bytes)
┃   ┣━━ 📄 Accelerate The Science of Lean Software and DevOps Building and Scaling High Performing Technology Organizations.md (290 bytes)
┃   ┣━━ 📄 All the Birds in the Sky.md (200 bytes)
┃   ┣━━ 📄 Anathem.md (189 bytes)
┃   ┣━━ 📄 Ancillary Justice 1 Imperial Radch.md (204 bytes)
┃   ┗━━ 👀 ...
┗━━ 📂 words
    ┣━━ 📄 abode.md (598 bytes)
    ┣━━ 📄 abseil.md (452 bytes)
    ┣━━ 📄 abstruse.md (656 bytes)
    ┣━━ 📄 abut.md (335 bytes)
    ┣━━ 📄 actively.md (408 bytes)
    ┗━━ 👀 ...
```

## Usage

1. Connect Kindle with a cable, mount it
2. (Optional) Copy Kindle's database to your drive
    `cp /Volumes/Kindle/system/vocabulary/vocab.db ./vocab.db`
3. Run the script with `--database ./vocab.db --output ./out`
3. Enjoy words and books in the `./out` directory

## Inspired by

Heavily inspired by [obsidian-kindle-plugin](https://github.com/hadynz/obsidian-kindle-plugin), but without actual integration with Obsidian 😝

## Assumptions

- highly depends on structure of the Kindle vocabulary database
- the files have to have readable front matter [see this for technical details](https://www.npmjs.com/package/gray-matter)

## Next steps

- [ ] Set tags via CLI
- [ ] pre-commit & husky
- [ ] Make highlights optional (CLI option)
- [x] Github or Gitlab? (rather 1 for social)
- [x] Github Actions
- [x] Flesh out the readme
- [ ] Show some examples (attach test data)
- [ ] Publish to NPM [docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [ ] Impl. filter by book `--book UNIQUE-ENOUGH-STRING`
- [ ] Impl. filter by date `--start-after DATE[2023-03-11]`
- [ ] copy-db-before-query

## Details

### Development

Run main.ts: `npm run main -- --output ./out` or `npm run --silent main -- --output ./out`

### Tools

[Nunjucks](https://mozilla.github.io/nunjucks/templating.html)
[Gray Matter](https://www.npmjs.com/package/gray-matter)

Maybe:
[chalk for richer TUI](https://github.com/chalk/chalk)

### Kindle vocabulary

It's a SQLite database with just 4 important tables:

- lookups
  - timestamp
  - usage (ie. context)
  - pos (ie. position in the book, probably)
- words
  - stem
- dict_inf (optional, really, there's also `words.lang`, but it can have variant)
  - langin / langout (ie. normalised language code)
- book_info
  - asin & guid
  - authors
  - title

Book titles should be unique, Lookups are unique, words - aren't (word can be looked up multiple times).

#### Example query

```sqlite
SELECT L.timestamp,
       W.stem,
       L.usage,
       L.pos,
       BI.title,
       BI.authors,
       coalesce(DI.langout, 'en')
FROM LOOKUPS L
         INNER JOIN WORDS W on L.word_key = W.id
         INNER JOIN BOOK_INFO BI on L.book_key = BI.id
         LEFT OUTER JOIN DICT_INFO DI on L.dict_key = DI.id
WHERE W.stem = 'organza'
```
