export interface BookInfo {
  id: string;
  asin: string;
  guid: string;
  lang: string;
  title: string;
  authors: string;
}
export interface DictInfo {
  id: string;
  asin: string;
  langin: string;
  langout: string;
}
export interface Lookup {
  id: string;
  word_key: string;
  book_key: string;
  dict_key: string;
  pos: string;
  usage: string;
  timestamp: number;
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
export interface Word {
  id: string;
  word: string;
  stem: string;
  lang: string;
  category: number;
  timestamp: number;
  profileid: string;
}
