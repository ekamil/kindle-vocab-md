# Export kindle vocabulary to Markdown

## Assumptions
### Kindle vocabulary
It's a sqllite database with just 4 important tables:
- lookups
  - timestamp
  - usage (ie. context)
  - pos (ie. position in the book, probably)
- words
  - stem
- dict_inf (optional, really, there's also `words.lang`, but it can have variant)
  - langin / langout (ie. normalised language code)
- book_info
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

## Results
Can be either a single Markdown table or a folder containing file for each book or each word.

All three options should preserve place for comments

Optional: highlight with `::word::` the word in context
Set tags

### if word-centric
Each lookup is a section, maybe a [callout](https://help.obsidian.md/How+to/Use+callouts)

### if book centric
if there are two books with the same title - append asin (for stability) or `authors.split[-1]`.
even if not book centric - I'd like to create book notes for linking

# Tools
https://github.com/chalk/chalk
https://typescript.tv/hands-on/parse-command-line-arguments-in-nodejs/
https://typescript.tv/hands-on/understanding-generators-iterators-and-iterables/

[Nunjucks](https://mozilla.github.io/nunjucks/api.html)
  - https://github.com/hadynz/obsidian-kindle-plugin/tree/master/src/rendering

Gray-matter
https://github.com/hadynz/obsidian-kindle-plugin/blob/5b804919b97df4b06981b6ad227f3d6933a5529d/src/utils/frontmatter.ts
https://www.npmjs.com/package/gray-matter

```javascript
> console.log(matter.stringify('', {title: 'Home', meta: {'kindle-lookup-id': 123} }));
```


## Development

Run main.ts: `npm run main -- --format csv`


## Ideas
`--start-after TIMESTAMP`
`--book UNIQUE-ENOUGH-STRING`