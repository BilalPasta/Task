// src/common/decorators/transform-to-case.decorator.ts
import { Transform } from 'class-transformer';

export function TransformToCase(targetCase: 'lower' | 'upper') {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return targetCase === 'lower' ? value.toLowerCase() : value.toUpperCase();
    }
    return value;
  });
}
