import { Transform } from 'class-transformer';

export function ReplaceSpaces(replacement: string) {
  return Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/\s+/g, replacement) : value,
  );
}
