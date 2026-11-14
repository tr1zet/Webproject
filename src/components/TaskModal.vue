<script setup lang="ts">
import { nextTick, ref } from 'vue'
import type { TaskSavePayload, TodoTask } from '../types/todo'

const emit = defineEmits<{
  save: [payload: TaskSavePayload]
}>()

const dialog = ref<HTMLDialogElement | null>(null)
const titleInput = ref<HTMLInputElement | null>(null)
const title = ref('')
const error = ref('')
const editingId = ref<string | null>(null)
let dialogTrigger: HTMLElement | null = null

function open(
  task: TodoTask | null = null,
  trigger: Element | null = document.activeElement
): void {
  editingId.value = task?.id ?? null
  title.value = task?.title ?? ''
  error.value = ''
  dialogTrigger = trigger instanceof HTMLElement ? trigger : null
  dialog.value?.showModal()
  void nextTick(() => titleInput.value?.focus())
}

function close(): void {
  if (dialog.value?.open) dialog.value.close()
}

function submit(): void {
  const normalizedTitle = title.value.trim()
  if (!normalizedTitle) {
    error.value = 'Введите название задачи.'
    titleInput.value?.focus()
    return
  }

  emit('save', { id: editingId.value, title: normalizedTitle })
  close()
}

function clearError(): void {
  if (title.value.trim()) error.value = ''
}

function handleClose(): void {
  title.value = ''
  error.value = ''
  editingId.value = null
  void nextTick(() => {
    if (dialogTrigger?.isConnected) dialogTrigger.focus()
    dialogTrigger = null
  })
}

function handleBackdropClick(event: MouseEvent): void {
  if (event.target === dialog.value) close()
}

defineExpose({ open })
</script>

<template>
  <dialog
    ref="dialog"
    class="modal"
    aria-labelledby="dialog-title"
    aria-describedby="dialog-hint"
    @close="handleClose"
    @click="handleBackdropClick"
  >
    <form
      class="modal__panel"
      method="dialog"
      novalidate
      @submit.prevent="submit"
    >
      <div class="modal__heading">
        <div>
          <p class="modal__eyebrow">План на сегодня</p>
          <h2 id="dialog-title" class="modal__title">
            {{ editingId === null ? 'Новая задача' : 'Редактировать задачу' }}
          </h2>
        </div>
        <button
          class="icon-button"
          type="button"
          aria-label="Закрыть окно"
          @click="close"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="m6 6 12 12M18 6 6 18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
      <p id="dialog-hint" class="modal__hint">
        Введите короткое и понятное название.
      </p>
      <div class="field">
        <label class="field__label" for="task-title-input"
          >Название задачи</label
        >
        <input
          id="task-title-input"
          ref="titleInput"
          v-model="title"
          class="field__input"
          name="title"
          type="text"
          maxlength="120"
          required
          autocomplete="off"
          aria-describedby="task-title-error"
          :aria-invalid="error ? 'true' : undefined"
          @input="clearError"
        />
        <p v-if="error" id="task-title-error" class="field__error" role="alert">
          {{ error }}
        </p>
        <p
          v-else
          id="task-title-error"
          class="field__error"
          aria-hidden="true"
        ></p>
      </div>
      <div class="modal__actions">
        <button class="button button--secondary" type="button" @click="close">
          Отмена
        </button>
        <button class="button button--primary" type="submit">
          {{ editingId === null ? 'Добавить' : 'Сохранить' }}
        </button>
      </div>
    </form>
  </dialog>
</template>
