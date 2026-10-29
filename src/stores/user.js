import { defineStore } from 'pinia';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^[\x21-\x7E]+$/;

function createId() {
  if (typeof crypto?.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUserId: null
  }),

  getters: {
    currentUser: (state) => state.users.find((user) => user.id === state.currentUserId) ?? null,
    isAuthenticated() {
      return this.currentUser !== null;
    }
  },

  actions: {
    register({ email, password, passwordConfirmation }) {
      const normalizedEmail = email.trim().toLocaleLowerCase('ru');
      const errors = {};

      if (!EMAIL_PATTERN.test(normalizedEmail)) {
        errors.email = 'Введите корректный адрес электронной почты.';
      } else if (this.users.some((user) => user.email === normalizedEmail)) {
        errors.email = 'Пользователь с таким email уже зарегистрирован.';
      }

      if (password.length < 6) {
        errors.password = 'Пароль должен содержать не менее 6 символов.';
      } else if (!PASSWORD_PATTERN.test(password)) {
        errors.password = 'Используйте только латинские буквы, цифры и специальные символы.';
      }

      if (password !== passwordConfirmation) {
        errors.passwordConfirmation = 'Пароли не совпадают.';
      }

      if (Object.keys(errors).length > 0) return { success: false, errors };

      this.users.push({
        id: createId(),
        email: normalizedEmail,
        password
      });
      return { success: true };
    },

    login({ email, password }) {
      const normalizedEmail = email.trim().toLocaleLowerCase('ru');
      const user = this.users.find((item) => (
        item.email === normalizedEmail && item.password === password
      ));

      if (!user) {
        return { success: false, error: 'Неверный email или пароль.' };
      }

      this.currentUserId = user.id;
      return { success: true };
    },

    logout() {
      this.currentUserId = null;
    }
  },

  persist: {
    key: 'accessible-todo-users-v1',
    pick: ['users', 'currentUserId']
  }
});
