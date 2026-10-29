<script setup>
defineProps({
  theme: {
    type: String,
    required: true
  }
});

defineEmits(['toggle']);
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-pressed="theme === 'dark'"
    @click="$emit('toggle')"
  >
    <svg class="theme-toggle__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path d="M12 3a1 1 0 0 1 1-1h.01a1 1 0 0 1 0 2H13a1 1 0 0 1-1-1Zm0 18a1 1 0 0 1 1-1h.01a1 1 0 0 1 0 2H13a1 1 0 0 1-1-1ZM4.22 5.64a1 1 0 0 1 1.42-1.42l.01.01a1 1 0 0 1-1.42 1.42l-.01-.01Zm12.73 12.73a1 1 0 0 1 1.42-1.42l.01.01a1 1 0 0 1-1.42 1.42l-.01-.01ZM2 12a1 1 0 0 1 1-1h.01a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1Zm18 0a1 1 0 0 1 1-1h.01a1 1 0 0 1 0 2H21a1 1 0 0 1-1-1ZM4.22 18.36a1 1 0 0 1 0-1.41l.01-.01a1 1 0 0 1 1.42 1.42l-.01.01a1 1 0 0 1-1.42-.01ZM16.95 5.63a1 1 0 0 1 0-1.41l.01-.01a1 1 0 1 1 1.42 1.42l-.01.01a1 1 0 0 1-1.42-.01ZM17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" fill="currentColor" />
    </svg>
    <span>{{ theme === 'dark' ? 'Светлая тема' : 'Тёмная тема' }}</span>
  </button>
</template>
