export function formatInput(value: number): string;
export function formatInput(value: string): string;
export function formatInput(value: Date): string;
export function formatInput(value: number | string | Date): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  switch (typeof value) {
    case 'number':
      return value.toFixed(2);
    case 'string':
      return value.trim();
    default: {
      const exhaustiveCheck: never = value;
      return exhaustiveCheck;
    }
  }
}

console.log('Число:', formatInput(42.567));
console.log('Строка:', formatInput('  TypeScript  '));
console.log('Дата:', formatInput(new Date('2026-10-31T08:30:00.000Z')));
