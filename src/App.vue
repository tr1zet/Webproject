<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import SearchBar from './components/SearchBar.vue';
import TaskModal from './components/TaskModal.vue';
import ThemeToggle from './components/ThemeToggle.vue';
import TodoList from './components/TodoList.vue';

const STORAGE_KEY = 'accessible-todo-tasks';
const THEME_KEY = 'todo-theme';

function loadTasks() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(stored)) return [];

    const ids = new Set();
    return stored.flatMap((task) => {
      const valid = task
        && (typeof task.id === 'string' || typeof task.id === 'number')
        && typeof task.title === 'string'
        && task.title.trim().length > 0
        && typeof task.done === 'boolean';
      const id = String(task?.id);
      if (!valid || ids.has(id)) return [];
      ids.add(id);
      return [{ id, title: task.title.trim().slice(0, 120), done: task.done }];
    });
  } catch {
    return [];
  }
}

function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // The system preference remains available when storage is blocked.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const tasks = ref(loadTasks());
const searchQuery = ref('');
const theme = ref(loadTheme());
const liveMessage = ref('');
const taskModal = ref(null);
const addButton = ref(null);
let announceTimer;

const visibleTasks = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('ru');
  return [...tasks.value]
    .sort((first, second) => Number(first.done) - Number(second.done))
    .filter((task) => task.title.toLocaleLowerCase('ru').includes(query));
});

const completedCount = computed(() => tasks.value.filter((task) => task.done).length);
const searchActive = computed(() => searchQuery.value.trim().length > 0);

const counterText = computed(() => {
  if (searchActive.value) return `Найдено: ${pluralizeTasks(visibleTasks.value.length)}`;
  if (tasks.value.length === 0) return 'Нет задач';
  return `${pluralizeTasks(tasks.value.length)}, выполнено: ${completedCount.value}`;
});

watch(tasks, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    announce('Не удалось сохранить изменения в браузере.');
  }
}, { deep: true });

watch(theme, (value) => {
  document.documentElement.dataset.theme = value;
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch {
    // Theme switching still works when storage is unavailable.
  }
}, { immediate: true });

function pluralizeTasks(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} задача`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} задачи`;
  return `${count} задач`;
}

function announce(message) {
  window.clearTimeout(announceTimer);
  liveMessage.value = '';
  announceTimer = window.setTimeout(() => {
    liveMessage.value = message;
  }, 30);
}

function createId() {
  const existing = new Set(tasks.value.map((task) => task.id));
  let id;
  do {
    id = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  } while (existing.has(id));
  return id;
}

function openCreateModal() {
  taskModal.value.open(null, addButton.value);
}

function openEditModal(task, trigger) {
  taskModal.value.open(task, trigger);
}

function saveTask({ id, title }) {
  if (id === null) {
    tasks.value.push({ id: createId(), title, done: false });
    announce(`Задача «${title}» добавлена.`);
    return;
  }

  const task = tasks.value.find((item) => item.id === id);
  if (task) {
    task.title = title;
    announce(`Задача «${title}» изменена.`);
  }
}

async function toggleTask(id, done) {
  const task = tasks.value.find((item) => item.id === id);
  if (!task) return;
  task.done = done;
  await nextTick();
  const checkbox = [...document.querySelectorAll('.task__checkbox')]
    .find((element) => element.dataset.taskId === id);
  checkbox?.focus();
  announce(`Задача «${task.title}» ${done ? 'выполнена' : 'возвращена в работу'}.`);
}

async function deleteTask(id) {
  const before = visibleTasks.value;
  const deletedIndex = before.findIndex((task) => task.id === id);
  const deletedTask = tasks.value.find((task) => task.id === id);
  const focusCandidate = before[deletedIndex + 1] ?? before[deletedIndex - 1] ?? null;
  tasks.value = tasks.value.filter((task) => task.id !== id);

  await nextTick();
  const checkbox = focusCandidate
    ? [...document.querySelectorAll('.task__checkbox')]
      .find((element) => element.dataset.taskId === focusCandidate.id)
    : null;
  (checkbox ?? addButton.value)?.focus();
  announce(`Задача «${deletedTask?.title ?? ''}» удалена.`);
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  announce(`Включена ${theme.value === 'dark' ? 'тёмная' : 'светлая'} тема.`);
}
</script>

<template>
  <a class="skip-link" href="#task-list-title">Перейти к списку задач</a>

  <main class="app-shell">
    <section class="todo" aria-labelledby="page-title">
      <header class="todo__header">
        <div>
          <p class="todo__eyebrow">Организуйте свой день</p>
          <h1 id="page-title" class="todo__title">Мои задачи</h1>
        </div>
        <ThemeToggle :theme="theme" @toggle="toggleTheme" />
      </header>

      <div class="todo__toolbar">
        <SearchBar v-model="searchQuery" />
        <button ref="addButton" class="button button--primary" type="button" @click="openCreateModal">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
            <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <span>Добавить задачу</span>
        </button>
      </div>

      <div class="todo__summary" aria-live="polite" aria-atomic="true">
        <h2 id="task-list-title" class="todo__list-title">Список задач</h2>
        <p class="todo__counter">{{ counterText }}</p>
      </div>

      <TodoList
        v-if="visibleTasks.length > 0"
        :tasks="visibleTasks"
        @toggle="toggleTask"
        @edit="openEditModal"
        @delete="deleteTask"
      />

      <div v-else class="empty-state">
        <svg class="empty-state__icon" viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" focusable="false">
          <path d="M18 10h28a6 6 0 0 1 6 6v36H12V16a6 6 0 0 1 6-6Z" fill="none" stroke="currentColor" stroke-width="3" />
          <path d="M23 25h18M23 35h18" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          <path d="m23 44 4 4 9-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <h2 class="empty-state__title">{{ searchActive ? 'Ничего не найдено' : 'Задач пока нет' }}</h2>
        <p class="empty-state__text">
          {{ searchActive ? 'Попробуйте изменить поисковый запрос.' : 'Добавьте первую задачу — и начните двигаться к цели.' }}
        </p>
      </div>
    </section>
  </main>

  <TaskModal ref="taskModal" @save="saveTask" />
  <div class="visually-hidden" aria-live="polite" aria-atomic="true">{{ liveMessage }}</div>
</template>
