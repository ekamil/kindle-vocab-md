export interface Lookup {
  id: string;
  word_key: string;
  book_key: string;
  dict_key: string;
  pos: string;
  usage: string;
  timestamp: number;
}
export interface Word {
  id: string;
  word: string;
  lang: string;
  stem: string;
  timestamp: number;
}
