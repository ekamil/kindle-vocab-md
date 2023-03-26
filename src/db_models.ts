export type BookKey = string;
export type WordKey = string;
export type DictionaryKey = string;

export interface BookInfo {
  id: BookKey;
  asin: string;
  guid: string;
  lang: string;
  title: string;
  authors: string;
}

export interface Word {
  id: WordKey;
  word: string;
  stem: string;
  lang: string;
  category: number;
  timestamp: number;
  profileid?: string;
}

export interface Lookup {
  id: string;
  word_key: WordKey;
  book_key: BookKey;
  dict_key: DictionaryKey;
  pos: string;
  usage: string;
  timestamp: number;
}

export interface DictInfo {
  id: DictionaryKey;
  asin: string;
  langin: string;
  langout: string;
}

export interface Metadata {
  id: string;
  dsname: string;
  sscnt: number;
  profileid: string;
}

export interface Version {
  id: string;
  dsname: string;
  value: number;
}
