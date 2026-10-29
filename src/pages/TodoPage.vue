<script setup>
import { computed, nextTick, ref } from 'vue';
import SearchBar from '../components/SearchBar.vue';
import TaskModal from '../components/TaskModal.vue';
import TodoList from '../components/TodoList.vue';
import { useTodoStore } from '../stores/todo';
import { useUserStore } from '../stores/user';

const todoStore = useTodoStore();
const userStore = useUserStore();
const searchQuery = ref('');
const liveMessage = ref('');
const taskModal = ref(null);
const addButton = ref(null);
let announceTimer;

const visibleTasks = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('ru');
  return [...todoStore.currentTasks]
    .sort((first, second) => Number(first.done) - Number(second.done))
    .filter((task) => task.title.toLocaleLowerCase('ru').includes(query));
});

const completedCount = computed(() => todoStore.currentTasks.filter((task) => task.done).length);
const searchActive = computed(() => searchQuery.value.trim().length > 0);

const counterText = computed(() => {
  if (searchActive.value) return `Найдено: ${pluralizeTasks(visibleTasks.value.length)}`;
  if (todoStore.currentTasks.length === 0) return 'Нет задач';
  return `${pluralizeTasks(todoStore.currentTasks.length)}, выполнено: ${completedCount.value}`;
});

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

function openCreateModal() {
  taskModal.value.open(null, addButton.value);
}

function openEditModal(task, trigger) {
  taskModal.value.open(task, trigger);
}

function saveTask({ id, title }) {
  if (id === null) {
    todoStore.addTask(title);
    announce(`Задача «${title}» добавлена.`);
    return;
  }

  if (todoStore.updateTask(id, title)) announce(`Задача «${title}» изменена.`);
}

async function toggleTask(id, done) {
  const task = todoStore.toggleTask(id, done);
  if (!task) return;
  await nextTick();
  const checkbox = [...document.querySelectorAll('.task__checkbox')]
    .find((element) => element.dataset.taskId === id);
  checkbox?.focus();
  announce(`Задача «${task.title}» ${done ? 'выполнена' : 'возвращена в работу'}.`);
}

async function deleteTask(id) {
  const before = visibleTasks.value;
  const deletedIndex = before.findIndex((task) => task.id === id);
  const focusCandidate = before[deletedIndex + 1] ?? before[deletedIndex - 1] ?? null;
  const deletedTask = todoStore.removeTask(id);
  if (!deletedTask) return;

  await nextTick();
  const checkbox = focusCandidate
    ? [...document.querySelectorAll('.task__checkbox')]
      .find((element) => element.dataset.taskId === focusCandidate.id)
    : null;
  (checkbox ?? addButton.value)?.focus();
  announce(`Задача «${deletedTask.title}» удалена.`);
}
</script>

<template>
  <section class="todo" aria-labelledby="page-title">
    <header class="todo__header">
      <div>
        <p class="todo__eyebrow">Личное пространство</p>
        <h1 id="page-title" class="todo__title">Мои задачи</h1>
        <p class="todo__owner">Аккаунт: {{ userStore.currentUser?.email }}</p>
      </div>
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
        {{ searchActive ? 'Попробуйте изменить поисковый запрос.' : 'Добавьте первую личную задачу — и начните двигаться к цели.' }}
      </p>
    </div>
  </section>

  <TaskModal ref="taskModal" @save="saveTask" />
  <div class="visually-hidden" aria-live="polite" aria-atomic="true">{{ liveMessage }}</div>
</template>
