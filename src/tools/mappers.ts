import { Book } from "../domain_models";
import type { TemplateVars } from "../templates";

type BookVars = TemplateVars["books"][0];

export const book_to_template_vars = (book: Book): BookVars => {
  const mapped = {
    safe_title: book.safe_title,
    title: book.title,
    authors: book.authors,
    asin: book.asin,
    guid: book.guid,
    latest_lookup_date: new Date().toISOString(),
  };
  return mapped;
};
