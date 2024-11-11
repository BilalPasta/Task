import { Transform } from 'class-transformer';

export function TransformEmail() {
  return Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  );
}
