# Export kindle vocabulary to Markdown

This program (script) is a way to liberate your "Vocabulary Builder" highlights from Kindle.

There are alternatives but my goal here was to export in a way compatible with [Obsidian](https://obsidian.md/) - ie. into a directory of markdown files.

**Important: backup the output directory before running**

The script shouldn't delete anything, but better safe than sorry!

## Usage

1. Connect Kindle with a cable, mount it
2. (Optional) Copy Kindle's database to your drive
   `cp /Volumes/Kindle/system/vocabulary/vocab.db ./vocab.db`
3. Run the script with `npx @ekamil/kindle-vocab-cli --database ./vocab.db --output ./out`
4. Enjoy words and books in the `./out` directory

## Features

- grabs all words and books from your Kindle vocabulary database
- creates WikiLinks between from words to books
- safe to run repeatedly in the same directory (🤞🏽)

## Issues

See [issues](https://github.com/ekamil/kindle-vocab-md/issues)

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

## Inspired by

Heavily inspired by [obsidian-kindle-plugin](https://github.com/hadynz/obsidian-kindle-plugin), but without actual integration with Obsidian 😝

## Assumptions

- for reading: highly depends on structure of the Kindle vocabulary database
- for deduplication: the files have to have readable front matter [see this for technical details](https://www.npmjs.com/package/gray-matter)

## Next steps

See [issues](https://github.com/ekamil/kindle-vocab-md/issues)
