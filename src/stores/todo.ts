import { defineStore } from 'pinia'
import { useUserStore } from './user'
import type { TodoTask } from '../types/todo'

interface TodoState {
  tasks: TodoTask[]
}

function createId(tasks: TodoTask[]): string {
  const existing = new Set(tasks.map((task) => task.id))
  let id: string
  do {
    id =
      typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.floor(Math.random() * 1000000)}`
  } while (existing.has(id))
  return id
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isTodoTask(value: unknown): value is TodoTask {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.userId === 'string' &&
    typeof value.title === 'string' &&
    typeof value.done === 'boolean'
  )
}

export const useTodoStore = defineStore('todo', {
  state: (): TodoState => ({
    tasks: []
  }),

  getters: {
    currentTasks(state): TodoTask[] {
      const userStore = useUserStore()
      if (!userStore.currentUserId) return []
      return state.tasks.filter(
        (task) => task.userId === userStore.currentUserId
      )
    }
  },

  actions: {
    sanitizePersistedState(): void {
      const storedTasks: unknown = this.tasks
      this.tasks = Array.isArray(storedTasks)
        ? storedTasks.filter(isTodoTask)
        : []
    },

    addTask(title: string): TodoTask | null {
      const userStore = useUserStore()
      if (!userStore.currentUserId) return null

      const task: TodoTask = {
        id: createId(this.tasks),
        userId: userStore.currentUserId,
        title: title.trim().slice(0, 120),
        done: false
      }
      this.tasks.push(task)
      return task
    },

    updateTask(id: string, title: string): TodoTask | null {
      const task = this.findOwnedTask(id)
      if (!task) return null
      task.title = title.trim().slice(0, 120)
      return task
    },

    toggleTask(id: string, done: boolean): TodoTask | null {
      const task = this.findOwnedTask(id)
      if (!task) return null
      task.done = done
      return task
    },

    removeTask(id: string): TodoTask | null {
      const userStore = useUserStore()
      const index = this.tasks.findIndex(
        (task) => task.id === id && task.userId === userStore.currentUserId
      )
      if (index === -1) return null
      return this.tasks.splice(index, 1)[0] ?? null
    },

    findOwnedTask(id: string): TodoTask | null {
      const userStore = useUserStore()
      return (
        this.tasks.find(
          (task) => task.id === id && task.userId === userStore.currentUserId
        ) ?? null
      )
    }
  },

  persist: {
    key: 'accessible-todo-user-tasks-v1',
    pick: ['tasks']
  }
})
