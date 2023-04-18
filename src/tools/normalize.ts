import unidecode from "unidecode";

const disallowed = /[^a-zA-Z0-9]/g;
const probably_series_name = /\(\w.*\)/g;

const shorten_title = (title: string) => {
  const segments = title.split(":");
  if (segments.length > 1) {
    segments.pop();
  }
  return segments.join(" ");
};

const remove_series = (title: string) => {
  // series name like in Interference (Semiosis Duology)
  return title.replaceAll(probably_series_name, "");
};

const normalize_string = (s: string) => {
  return unidecode(s.normalize())
    .replaceAll(disallowed, " ")
    .replaceAll(/ +/g, " ")
    .trim();
};

export function normalize_book_title(title: string): string {
  // safe title - as in ready to be a file name
  var normalized = shorten_title(title);
  normalized = remove_series(normalized);
  normalized = normalize_string(normalized);
  return normalized;
}

export function normalize_word(word: string): string {
  // safe word stem - ready to be a file name
  return normalize_string(word);
}
