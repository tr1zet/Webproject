<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="search">
    <label class="visually-hidden" for="task-search">Поиск задач</label>
    <svg class="search__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path d="m20 20-4.35-4.35m2.35-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
    <input
      id="task-search"
      class="search__input"
      type="search"
      placeholder="Найти задачу…"
      autocomplete="off"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  </div>
</template>
