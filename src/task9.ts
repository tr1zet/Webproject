export type Primitive = string | number | boolean | bigint | symbol | null | undefined;
export type Freezable = Primitive | readonly Freezable[] | { readonly [key: string]: Freezable };

export type DeepReadonly<T> =
  T extends Primitive
    ? T
    : T extends readonly (infer Item)[]
      ? readonly DeepReadonly<Item>[]
      : T extends { readonly [key: string]: Freezable }
        ? { readonly [Key in keyof T]: DeepReadonly<T[Key]> }
        : never;

export function deepFreeze<T extends Freezable>(obj: T): DeepReadonly<T> {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      deepFreeze(item);
    }
    Object.freeze(obj);
  } else if (obj !== null && typeof obj === 'object') {
    const record = obj as Readonly<Record<string, Freezable>>;
    for (const value of Object.values(record)) {
      deepFreeze(value);
    }
    Object.freeze(obj);
  }

  return obj as DeepReadonly<T>;
}

const settings = {
  project: {
    name: 'Лабораторная №8',
    options: {
      strict: true,
      tags: [
        { name: 'TypeScript', priority: 1 },
        { name: 'Node.js', priority: 2 }
      ]
    }
  }
};

const frozenSettings = deepFreeze(settings);

console.log('Корень заморожен:', Object.isFrozen(frozenSettings));
console.log('Вложенный объект заморожен:', Object.isFrozen(frozenSettings.project.options));
console.log('Массив заморожен:', Object.isFrozen(frozenSettings.project.options.tags));
console.log('Элемент массива заморожен:', Object.isFrozen(frozenSettings.project.options.tags[0]));
console.log('Данные:', frozenSettings);
