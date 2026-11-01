export type UserId = string & { readonly brand: unique symbol };

const USER_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUserId(value: unknown): value is UserId {
  return typeof value === 'string' && USER_ID_PATTERN.test(value);
}

function getUserProfile(id: UserId): { id: UserId; name: string } {
  return { id, name: 'Демонстрационный пользователь' };
}

const candidates: unknown[] = [
  '123e4567-e89b-12d3-a456-426614174000',
  'not-a-uuid',
  12345
];

for (const candidate of candidates) {
  if (isUserId(candidate)) {
    console.log('Профиль:', getUserProfile(candidate));
  } else {
    console.log('Некорректный идентификатор:', candidate);
  }
}
