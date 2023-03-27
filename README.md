# Export kindle vocabulary to Markdown

About, what it does, what it does not.

insert fs tree

Features:

- grabs all words and books
- WikiLinks between notes (for Obsidian)
- safe to run in the same directory

## Usage

Flow from connecting Kindle to running the tool to obsidian
Optional: highlight with `::word::` the word in context

## Inspired by

- [obsidian-kindle-plugin](https://github.com/hadynz/obsidian-kindle-plugin)

## Assumptions

- highly depends on structure of the Kindle vocabulary database
- the files have to have readable front matter [see this for technical details](https://www.npmjs.com/package/gray-matter)

## Next steps

- [ ] Set tags via CLI
- [ ] pre-commit & husky
- [ ] Make highlights optional (CLI option)
- [ ] Github or Gitlab? (rather 1 for social)
- [ ] Github Actions
- [ ] Flesh out the readme
- [ ] Show some examples (attach test data)
- [ ] Impl. filter by book `--book UNIQUE-ENOUGH-STRING`
- [ ] Impl. filter by date `--start-after DATE[2023-03-11]`

## Details

### Development

Run main.ts: `npm run main -- --output ./out` or `npm run --silent main -- --output ./out`

### Tools

[Nunjucks](https://mozilla.github.io/nunjucks/templating.html)
[Gray Matter](https://www.npmjs.com/package/gray-matter)

Maybe:
[chalk for richer TUI](https://github.com/chalk/chalk)

### Kindle vocabulary

It's a SQLLite database with just 4 important tables:

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
