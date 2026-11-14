import { defineStore } from 'pinia'
import type {
  LoginFields,
  LoginResult,
  RegistrationFields,
  RegistrationResult,
  User
} from '../types/user'

interface UserState {
  users: User[]
  currentUserId: string | null
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_PATTERN = /^[\x21-\x7E]+$/

function createId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isUser(value: unknown): value is User {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.email === 'string' &&
    typeof value.password === 'string'
  )
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUserId: null
  }),

  getters: {
    currentUser: (state): User | null =>
      state.users.find((user) => user.id === state.currentUserId) ?? null,
    isAuthenticated(): boolean {
      return this.currentUser !== null
    }
  },

  actions: {
    sanitizePersistedState(): void {
      const storedUsers: unknown = this.users
      this.users = Array.isArray(storedUsers) ? storedUsers.filter(isUser) : []
      if (
        typeof this.currentUserId !== 'string' ||
        !this.users.some((user) => user.id === this.currentUserId)
      ) {
        this.currentUserId = null
      }
    },

    register({
      email,
      password,
      passwordConfirmation
    }: RegistrationFields): RegistrationResult {
      const normalizedEmail = email.trim().toLocaleLowerCase('ru')
      const errors: {
        email?: string
        password?: string
        passwordConfirmation?: string
      } = {}

      if (!EMAIL_PATTERN.test(normalizedEmail)) {
        errors.email = 'Введите корректный адрес электронной почты.'
      } else if (this.users.some((user) => user.email === normalizedEmail)) {
        errors.email = 'Пользователь с таким email уже зарегистрирован.'
      }

      if (password.length < 6) {
        errors.password = 'Пароль должен содержать не менее 6 символов.'
      } else if (!PASSWORD_PATTERN.test(password)) {
        errors.password =
          'Используйте только латинские буквы, цифры и специальные символы.'
      }

      if (password !== passwordConfirmation) {
        errors.passwordConfirmation = 'Пароли не совпадают.'
      }

      if (Object.keys(errors).length > 0) return { success: false, errors }

      this.users.push({
        id: createId(),
        email: normalizedEmail,
        password
      })
      return { success: true }
    },

    login({ email, password }: LoginFields): LoginResult {
      const normalizedEmail = email.trim().toLocaleLowerCase('ru')
      const user = this.users.find(
        (item) => item.email === normalizedEmail && item.password === password
      )

      if (!user) {
        return { success: false, error: 'Неверный email или пароль.' }
      }

      this.currentUserId = user.id
      return { success: true }
    },

    logout(): void {
      this.currentUserId = null
    }
  },

  persist: {
    key: 'accessible-todo-users-v1',
    pick: ['users', 'currentUserId']
  }
})
