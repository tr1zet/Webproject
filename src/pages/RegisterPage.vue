<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();
const fields = reactive({ email: '', password: '', passwordConfirmation: '' });
const errors = reactive({ email: '', password: '', passwordConfirmation: '' });

function clearErrors() {
  errors.email = '';
  errors.password = '';
  errors.passwordConfirmation = '';
}

async function submit() {
  clearErrors();
  const result = userStore.register(fields);
  if (!result.success) {
    Object.assign(errors, result.errors);
    return;
  }
  await router.push({ name: 'login', query: { registered: 'true' } });
}
</script>

<template>
  <section class="auth-page" aria-labelledby="register-title">
    <div class="auth-card">
      <p class="auth-card__eyebrow">Новый профиль</p>
      <h1 id="register-title" class="auth-card__title">Регистрация</h1>
      <p class="auth-card__intro">Создайте аккаунт — задачи каждого пользователя будут храниться отдельно.</p>

      <form class="auth-form" novalidate @submit.prevent="submit">
        <div class="field">
          <label class="field__label" for="register-email">Email</label>
          <input
            id="register-email"
            v-model="fields.email"
            class="field__input"
            type="email"
            autocomplete="email"
            required
            aria-describedby="register-email-error"
            :aria-invalid="errors.email ? 'true' : undefined"
            @input="errors.email = ''"
          >
          <p id="register-email-error" class="field__error" role="alert">{{ errors.email }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="register-password">Пароль</label>
          <input
            id="register-password"
            v-model="fields.password"
            class="field__input"
            type="password"
            autocomplete="new-password"
            required
            aria-describedby="register-password-hint register-password-error"
            :aria-invalid="errors.password ? 'true' : undefined"
            @input="errors.password = ''"
          >
          <p id="register-password-hint" class="field__hint">
            Минимум 6 символов: латинские буквы, цифры и специальные символы.
          </p>
          <p id="register-password-error" class="field__error" role="alert">{{ errors.password }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="register-password-confirmation">Повторите пароль</label>
          <input
            id="register-password-confirmation"
            v-model="fields.passwordConfirmation"
            class="field__input"
            type="password"
            autocomplete="new-password"
            required
            aria-describedby="register-confirmation-error"
            :aria-invalid="errors.passwordConfirmation ? 'true' : undefined"
            @input="errors.passwordConfirmation = ''"
          >
          <p id="register-confirmation-error" class="field__error" role="alert">{{ errors.passwordConfirmation }}</p>
        </div>

        <button class="button button--primary auth-form__submit" type="submit">Создать аккаунт</button>
      </form>

      <p class="auth-card__footer">
        Уже зарегистрированы?
        <RouterLink :to="{ name: 'login' }">Войти</RouterLink>
      </p>

      <p class="security-note">
        Аккаунт существует только в этом браузере. Не вводите настоящий email и не используйте реальный пароль.
      </p>
    </div>
  </section>
</template>
