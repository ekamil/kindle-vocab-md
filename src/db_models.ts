export type BookKey = string;
export type WordKey = string;
export type LookupKey = string;
export type DictionaryKey = string;

export interface BookT {
  id: BookKey;
  asin: string;
  guid: string;
  lang: string;
  title: string;
  authors: string;
}

export interface WordT {
  id: WordKey;
  word: string;
  stem: string;
  lang: string;
  category: number;
  timestamp: number;
  profileid?: string;
}

export interface LookupT {
  id: LookupKey;
  word_key: WordKey;
  book_key: BookKey;
  dict_key: DictionaryKey;
  pos: string;
  usage: string;
  timestamp: number;
}

export interface DictInfoT {
  id: DictionaryKey;
  asin: string;
  langin: string;
  langout: string;
}

export interface MetadataT {
  id: string;
  dsname: string;
  sscnt: number;
  profileid: string;
}

export interface VersionT {
  id: string;
  dsname: string;
  value: number;
}
