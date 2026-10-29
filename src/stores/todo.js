import { defineStore } from 'pinia';
import { useUserStore } from './user.js';

function createId(tasks) {
  const existing = new Set(tasks.map((task) => task.id));
  let id;
  do {
    id = typeof crypto?.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  } while (existing.has(id));
  return id;
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    tasks: []
  }),

  getters: {
    currentTasks(state) {
      const userStore = useUserStore();
      if (!userStore.currentUserId) return [];
      return state.tasks.filter((task) => task.userId === userStore.currentUserId);
    }
  },

  actions: {
    addTask(title) {
      const userStore = useUserStore();
      if (!userStore.currentUserId) return null;

      const task = {
        id: createId(this.tasks),
        userId: userStore.currentUserId,
        title: title.trim().slice(0, 120),
        done: false
      };
      this.tasks.push(task);
      return task;
    },

    updateTask(id, title) {
      const task = this.findOwnedTask(id);
      if (!task) return null;
      task.title = title.trim().slice(0, 120);
      return task;
    },

    toggleTask(id, done) {
      const task = this.findOwnedTask(id);
      if (!task) return null;
      task.done = done;
      return task;
    },

    removeTask(id) {
      const userStore = useUserStore();
      const index = this.tasks.findIndex((task) => (
        task.id === id && task.userId === userStore.currentUserId
      ));
      if (index === -1) return null;
      return this.tasks.splice(index, 1)[0];
    },

    findOwnedTask(id) {
      const userStore = useUserStore();
      return this.tasks.find((task) => (
        task.id === id && task.userId === userStore.currentUserId
      )) ?? null;
    }
  },

  persist: {
    key: 'accessible-todo-user-tasks-v1',
    pick: ['tasks']
  }
});
