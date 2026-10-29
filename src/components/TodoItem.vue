<script setup>
import { computed } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

defineEmits(['toggle', 'edit', 'delete']);

const safeId = computed(() => String(props.task.id).replace(/[^a-zA-Z0-9_-]/g, '-'));
const titleId = computed(() => `task-${safeId.value}-title`);
const checkboxId = computed(() => `task-${safeId.value}-done`);
</script>

<template>
  <li class="task" :data-done="String(task.done)">
    <div class="task__content">
      <input
        :id="checkboxId"
        class="task__checkbox"
        type="checkbox"
        :checked="task.done"
        :data-task-id="task.id"
        @change="$emit('toggle', task.id, $event.target.checked)"
      >
      <label :id="titleId" class="task__title" :for="checkboxId">{{ task.title }}</label>
      <span class="task__state">{{ task.done ? 'Выполнено' : 'В работе' }}</span>
    </div>
    <div class="task__actions">
      <button
        :id="`task-${safeId}-edit`"
        class="task__action task__action--edit"
        type="button"
        :aria-labelledby="`task-${safeId}-edit ${titleId}`"
        @click="$emit('edit', task, $event.currentTarget)"
      >
        <span class="visually-hidden">Редактировать задачу</span>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path d="M4 20h4l11-11a2.83 2.83 0 0 0-4-4L4 16v4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
          <path d="m13.5 6.5 4 4" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>
      <button
        :id="`task-${safeId}-delete`"
        class="task__action task__action--delete"
        type="button"
        :aria-labelledby="`task-${safeId}-delete ${titleId}`"
        @click="$emit('delete', task.id)"
      >
        <span class="visually-hidden">Удалить задачу</span>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </li>
</template>
