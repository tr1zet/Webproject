export function chunkArray<T>(items: readonly T[], chunkSize: number): T[][] {
  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new RangeError('Размер блока должен быть положительным целым числом.');
  }

  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }
  return chunks;
}

const numbers: readonly number[] = [1, 2, 3, 4, 5];
const words: readonly string[] = ['один', 'два', 'три', 'четыре'];

console.log('Числа с остатком:', chunkArray(numbers, 2));
console.log('Строки:', chunkArray(words, 3));
console.log('Пустой массив:', chunkArray([], 2));
console.log('Исходный массив:', numbers);

for (const invalidSize of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
  try {
    console.log(chunkArray(numbers, invalidSize));
  } catch (error: unknown) {
    if (error instanceof RangeError) {
      console.log(`Ожидаемая ошибка для размера ${String(invalidSize)}:`, error.message);
    }
  }
}
