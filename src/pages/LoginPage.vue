<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const fields = reactive({ email: '', password: '' });
const formError = ref('');

async function submit() {
  formError.value = '';
  const result = userStore.login(fields);
  if (!result.success) {
    formError.value = result.error;
    return;
  }

  const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
    ? route.query.redirect
    : '/tasks';
  await router.push(redirect);
}
</script>

<template>
  <section class="auth-page" aria-labelledby="login-title">
    <div class="auth-card">
      <p class="auth-card__eyebrow">С возвращением</p>
      <h1 id="login-title" class="auth-card__title">Вход в аккаунт</h1>
      <p class="auth-card__intro">Войдите, чтобы увидеть только свои сохранённые задачи.</p>

      <p v-if="route.query.registered === 'true'" class="form-notice form-notice--success" role="status">
        Регистрация завершена. Теперь войдите с созданными данными.
      </p>

      <form class="auth-form" novalidate @submit.prevent="submit">
        <div class="field">
          <label class="field__label" for="login-email">Email</label>
          <input
            id="login-email"
            v-model="fields.email"
            class="field__input"
            type="email"
            autocomplete="email"
            required
            @input="formError = ''"
          >
        </div>

        <div class="field">
          <label class="field__label" for="login-password">Пароль</label>
          <input
            id="login-password"
            v-model="fields.password"
            class="field__input"
            type="password"
            autocomplete="current-password"
            required
            @input="formError = ''"
          >
        </div>

        <p v-if="formError" class="form-notice form-notice--error" role="alert">{{ formError }}</p>

        <button class="button button--primary auth-form__submit" type="submit">Войти</button>
      </form>

      <p class="auth-card__footer">
        Нет аккаунта?
        <RouterLink :to="{ name: 'register' }">Зарегистрироваться</RouterLink>
      </p>

      <p class="security-note">
        Авторизация работает без сервера. Используйте только вымышленные данные и пароль, который нигде больше не применяется.
      </p>
    </div>
  </section>
</template>
