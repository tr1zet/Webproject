<script setup lang="ts">
import TodoItem from './TodoItem.vue'
import type { TodoTask } from '../types/todo'

defineProps<{
  tasks: TodoTask[]
}>()

const emit = defineEmits<{
  toggle: [id: string, done: boolean]
  edit: [task: TodoTask, trigger: HTMLElement]
  delete: [id: string]
}>()
</script>

<template>
  <ul class="task-list" aria-labelledby="task-list-title">
    <TodoItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @toggle="(id, done) => emit('toggle', id, done)"
      @edit="(item, trigger) => emit('edit', item, trigger)"
      @delete="(id) => emit('delete', id)"
    />
  </ul>
</template>
