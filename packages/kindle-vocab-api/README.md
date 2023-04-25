# Export kindle vocabulary to Markdown - API part

This library reads, parses and structures Kindle's Vocabulary Builder database.

Usage:

```typescript
import { getKindleVocabulary, Vocabulary } from "kindle-vocab-api";
const vocabulary = await getKindleVocabulary(options.database);
vocabulary.words.forEach(async (word) => {
  console.log(word);
});
```

**Important: backup the output directory before running**

The script shouldn't delete anything, but better safe than sorry!

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
