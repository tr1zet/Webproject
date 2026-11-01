export interface Repository<T extends { id: string }> {
  create(item: T): T;
  findById(id: string): T | undefined;
  update(id: string, changes: Partial<Omit<T, 'id'>>): T | undefined;
  delete(id: string): boolean;
}

export class MemoryRepository<T extends { id: string }> implements Repository<T> {
  private readonly items = new Map<string, T>();

  create(item: T): T {
    if (this.items.has(item.id)) {
      throw new Error(`Запись с id «${item.id}» уже существует.`);
    }
    this.items.set(item.id, item);
    return item;
  }

  findById(id: string): T | undefined {
    return this.items.get(id);
  }

  update(id: string, changes: Partial<Omit<T, 'id'>>): T | undefined {
    const existing = this.items.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...changes, id: existing.id };
    this.items.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.items.delete(id);
  }
}

type Book = {
  id: string;
  title: string;
  author: string;
  pages: number;
};

const books = new MemoryRepository<Book>();
const firstBook: Book = {
  id: 'book-1',
  title: 'Изучаем TypeScript',
  author: 'Автор курса',
  pages: 320
};

console.log('Создание:', books.create(firstBook));
console.log('Поиск:', books.findById('book-1'));
console.log('Обновление:', books.update('book-1', { pages: 350 }));
console.log('Обновление отсутствующей записи:', books.update('missing', { pages: 1 }));

try {
  books.create({ ...firstBook });
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log('Ожидаемая ошибка дубликата:', error.message);
  }
}

console.log('Удаление:', books.delete('book-1'));
console.log('Повторное удаление:', books.delete('book-1'));
console.log('Поиск отсутствующей записи:', books.findById('book-1'));
