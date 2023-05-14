export const lookup_template = `>[!quote] [[{{ book }}]] @ \`{{pos}}\`
> {{ usage }}
{% if date %}> @ {{date}}{% endif %}
`;

export const word_template = `---
Modified at: '{{ modified_at }}'
Latest lookup date: '{{  latest_lookup_date }}'
---
# {{ stem }}

>[!quote] {{ word }}

## Examples
`;

export const book_template = `---
tags:
  - book
ASIN: {{asin}}
Kindle guid: '{{guid}}'
Modified at: '{{ modified_at }}'
Status: Read
---

# {{title}}
Author:: {{authors}}
Cover:: #todo

`;

export type LookupVars = {
  usage: string;
  book: string; // safe title
  pos: string;
  date: string | null;
};

export type WordVars = {
  word: string;
  stem: string;
  lookups?: LookupVars[];
  latest_lookup_date?: string;
  modified_at: string;
};

export type BookVars = {
  // safe title - as in ready to be a file name
  safe_title: string;
  title: string;
  authors: string;
  asin: string;
  guid: string;
  modified_at: string;
};
