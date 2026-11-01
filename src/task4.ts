export function addTag(tags: readonly string[], tag: string): string[] {
  return tags.includes(tag) ? [...tags] : [...tags, tag];
}

export function removeTag(tags: readonly string[], tag: string): string[] {
  return tags.filter((currentTag) => currentTag !== tag);
}

export function mergeTags(first: readonly string[], second: readonly string[]): string[] {
  return [...new Set([...first, ...second])];
}

const primaryTags: readonly string[] = ['TypeScript', 'Node.js', 'TypeScript'];
const additionalTags: readonly string[] = ['node.js', 'Generics', 'Node.js'];

console.log('Добавление:', addTag(primaryTags, 'Strict'));
console.log('Без повторного добавления:', addTag(primaryTags, 'Node.js'));
console.log('Удаление всех совпадений:', removeTag(primaryTags, 'TypeScript'));
console.log('Объединение:', mergeTags(primaryTags, additionalTags));
console.log('Первый исходный массив:', primaryTags);
console.log('Второй исходный массив:', additionalTags);
