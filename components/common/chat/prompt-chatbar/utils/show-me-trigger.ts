export type ShowMeRange = {
  start: number;
  end: number;
};

export type HighlightedTextPart = {
  text: string;
  highlighted: boolean;
};

const SHOW_ME_PATTERN = /\bshow me\b/gi;

export function hasShowMeTrigger(text: string): boolean {
  return /\bshow me\b/i.test(text);
}

export function findShowMeRanges(text: string): ShowMeRange[] {
  const ranges: ShowMeRange[] = [];
  const pattern = new RegExp(SHOW_ME_PATTERN.source, SHOW_ME_PATTERN.flags);

  let match = pattern.exec(text);
  while (match !== null) {
    ranges.push({ start: match.index, end: match.index + match[0].length });
    match = pattern.exec(text);
  }

  return ranges;
}

export function splitTextByShowMeRanges(
  text: string,
  ranges: ShowMeRange[],
): HighlightedTextPart[] {
  if (ranges.length === 0) {
    return [{ text, highlighted: false }];
  }

  const parts: HighlightedTextPart[] = [];
  let cursor = 0;

  for (const range of ranges) {
    if (cursor < range.start) {
      parts.push({ text: text.slice(cursor, range.start), highlighted: false });
    }
    parts.push({ text: text.slice(range.start, range.end), highlighted: true });
    cursor = range.end;
  }

  if (cursor < text.length) {
    parts.push({ text: text.slice(cursor), highlighted: false });
  }

  return parts;
}
