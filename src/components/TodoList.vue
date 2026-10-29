<script setup>
import TodoItem from './TodoItem.vue';

defineProps({
  tasks: {
    type: Array,
    required: true
  }
});

defineEmits(['toggle', 'edit', 'delete']);
</script>

<template>
  <ul class="task-list" aria-labelledby="task-list-title">
    <TodoItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @toggle="(id, done) => $emit('toggle', id, done)"
      @edit="(item, trigger) => $emit('edit', item, trigger)"
      @delete="$emit('delete', $event)"
    />
  </ul>
</template>
