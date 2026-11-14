<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from './components/ThemeToggle.vue'
import { useUserStore } from './stores/user'

type Theme = 'light' | 'dark'

const THEME_KEY = 'todo-theme'

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') return saved
    return getSystemTheme()
  } catch {
    return getSystemTheme()
  }
}

const router = useRouter()
const userStore = useUserStore()
const theme = ref<Theme>(loadTheme())
const mainContent = ref<HTMLElement | null>(null)

watch(
  theme,
  (value) => {
    document.documentElement.dataset.theme = value
    try {
      localStorage.setItem(THEME_KEY, value)
    } catch {
      return
    }
  },
  { immediate: true }
)

function toggleTheme(): void {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

function focusMain(): void {
  mainContent.value?.focus()
}

async function logout(): Promise<void> {
  userStore.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content" @click.prevent="focusMain"
      >Перейти к основному содержимому</a
    >

    <header class="site-header">
      <div class="site-header__inner">
        <RouterLink
          class="site-brand"
          :to="{ name: 'about' }"
          aria-label="To-Do — на главную"
        >
          <span class="site-brand__mark" aria-hidden="true">✓</span>
          <span>To-Do</span>
        </RouterLink>

        <nav class="site-nav" aria-label="Основная навигация">
          <RouterLink class="site-nav__link" :to="{ name: 'about' }"
            >О приложении</RouterLink
          >
          <RouterLink
            v-if="userStore.isAuthenticated"
            class="site-nav__link"
            :to="{ name: 'tasks' }"
          >
            Мои задачи
          </RouterLink>
        </nav>

        <div class="site-header__actions">
          <nav
            v-if="!userStore.isAuthenticated"
            class="site-auth-nav"
            aria-label="Авторизация"
          >
            <RouterLink class="site-nav__link" :to="{ name: 'login' }"
              >Вход</RouterLink
            >
            <RouterLink class="site-nav__link" :to="{ name: 'register' }"
              >Регистрация</RouterLink
            >
          </nav>
          <span v-if="userStore.currentUser" class="account-email">{{
            userStore.currentUser.email
          }}</span>
          <button
            v-if="userStore.isAuthenticated"
            class="button button--secondary button--compact"
            type="button"
            @click="logout"
          >
            Выйти
          </button>
          <ThemeToggle :theme="theme" @toggle="toggleTheme" />
        </div>
      </div>
    </header>

    <main id="main-content" ref="mainContent" class="page-shell" tabindex="-1">
      <RouterView />
    </main>
  </div>
</template>
