(() => {
  'use strict';

  const STORAGE_KEY = 'accessible-todo-tasks';
  const THEME_KEY = 'todo-theme';

  const elements = {
    addButton: document.querySelector('.js-add-task'),
    counter: document.querySelector('.js-counter'),
    dialog: document.querySelector('.js-task-dialog'),
    dialogTitle: document.querySelector('#dialog-title'),
    emptyState: document.querySelector('.js-empty-state'),
    emptyText: document.querySelector('.js-empty-text'),
    emptyTitle: document.querySelector('.js-empty-title'),
    form: document.querySelector('.js-task-form'),
    formError: document.querySelector('.js-form-error'),
    list: document.querySelector('.js-task-list'),
    liveRegion: document.querySelector('.js-live-region'),
    search: document.querySelector('.js-search'),
    submitButton: document.querySelector('.js-submit-task'),
    themeButton: document.querySelector('.js-theme-toggle'),
    themeLabel: document.querySelector('.js-theme-label'),
    titleInput: document.querySelector('.js-task-title')
  };

  let tasks = loadTasks();
  let editingId = null;
  let dialogTrigger = null;

  function isValidTask(task) {
    return task
      && (typeof task.id === 'string' || typeof task.id === 'number')
      && typeof task.title === 'string'
      && task.title.trim().length > 0
      && typeof task.done === 'boolean';
  }

  function loadTasks() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      if (!Array.isArray(stored)) return [];
      return stored.filter(isValidTask).map((task) => ({
        id: String(task.id),
        title: task.title.trim().slice(0, 120),
        done: task.done
      }));
    } catch {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      announce('Не удалось сохранить изменения в браузере.');
    }
  }

  function createId() {
    const existing = new Set(tasks.map((task) => task.id));
    let id;
    do {
      id = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    } while (existing.has(id));
    return id;
  }

  function safeDomId(value) {
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '-');
  }

  function createIcon(paths) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    paths.forEach((attributes) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      Object.entries(attributes).forEach(([name, value]) => path.setAttribute(name, value));
      svg.append(path);
    });
    return svg;
  }

  function createActionButton(task, action, label, iconPaths) {
    const idPart = safeDomId(task.id);
    const button = document.createElement('button');
    const buttonId = `task-${idPart}-${action}`;
    button.className = action === 'delete'
      ? 'grid size-11 shrink-0 place-items-center rounded-xl text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-fuchsia-600 motion-reduce:transition-none dark:text-slate-300 dark:hover:bg-red-950 dark:hover:text-red-300 dark:focus-visible:outline-fuchsia-300'
      : 'grid size-11 shrink-0 place-items-center rounded-xl text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-fuchsia-600 motion-reduce:transition-none dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white dark:focus-visible:outline-fuchsia-300';
    button.type = 'button';
    button.id = buttonId;
    button.dataset.action = action;
    button.dataset.taskId = task.id;
    button.setAttribute('aria-labelledby', `${buttonId} task-${idPart}-title`);

    const hiddenLabel = document.createElement('span');
    hiddenLabel.className = 'sr-only';
    hiddenLabel.textContent = label;
    button.append(hiddenLabel, createIcon(iconPaths));
    return button;
  }

  function createTaskElement(task) {
    const idPart = safeDomId(task.id);
    const item = document.createElement('li');
    item.className = 'group flex min-w-0 items-start justify-between gap-2 rounded-2xl border border-slate-300 bg-slate-50 p-4 sm:items-center sm:gap-4 dark:border-slate-700 dark:bg-slate-800';
    item.dataset.task = '';
    item.dataset.taskId = task.id;
    item.dataset.done = String(task.done);

    const content = document.createElement('div');
    content.className = 'grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1 sm:grid-cols-[auto_minmax(0,1fr)_auto]';

    const checkbox = document.createElement('input');
    checkbox.className = 'size-5 cursor-pointer accent-indigo-700 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-fuchsia-600 dark:accent-indigo-300 dark:focus-visible:outline-fuchsia-300';
    checkbox.type = 'checkbox';
    checkbox.id = `task-${idPart}-done`;
    checkbox.checked = task.done;
    checkbox.dataset.action = 'toggle';
    checkbox.dataset.taskId = task.id;

    const label = document.createElement('label');
    label.className = 'cursor-pointer [overflow-wrap:anywhere] font-semibold group-data-[done=true]:text-slate-500 group-data-[done=true]:line-through group-data-[done=true]:decoration-2 dark:group-data-[done=true]:text-slate-400';
    label.id = `task-${idPart}-title`;
    label.htmlFor = checkbox.id;
    label.textContent = task.title;

    const state = document.createElement('span');
    state.className = 'col-start-2 w-fit rounded-full bg-slate-200 px-2 py-1 text-xs font-bold text-slate-700 sm:col-start-auto group-data-[done=true]:bg-green-100 group-data-[done=true]:text-green-800 dark:bg-slate-700 dark:text-slate-200 dark:group-data-[done=true]:bg-green-950 dark:group-data-[done=true]:text-green-300';
    state.textContent = task.done ? 'Выполнено' : 'В работе';
    content.append(checkbox, label, state);

    const actions = document.createElement('div');
    actions.className = 'flex shrink-0 gap-1';
    actions.append(
      createActionButton(task, 'edit', 'Редактировать задачу', [
        { d: 'M4 20h4l11-11a2.83 2.83 0 0 0-4-4L4 16v4Z', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linejoin': 'round' },
        { d: 'm13.5 6.5 4 4', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }
      ]),
      createActionButton(task, 'delete', 'Удалить задачу', [
        { d: 'M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
      ])
    );
    item.append(content, actions);
    return item;
  }

  function getVisibleTasks() {
    const query = elements.search.value.trim().toLocaleLowerCase('ru');
    return [...tasks]
      .sort((first, second) => Number(first.done) - Number(second.done))
      .filter((task) => task.title.toLocaleLowerCase('ru').includes(query));
  }

  function pluralizeTasks(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return `${count} задача`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} задачи`;
    return `${count} задач`;
  }

  function render({ focusTaskId = null } = {}) {
    const visibleTasks = getVisibleTasks();
    const fragment = document.createDocumentFragment();
    visibleTasks.forEach((task) => fragment.append(createTaskElement(task)));
    elements.list.replaceChildren(fragment);

    const completed = tasks.filter((task) => task.done).length;
    const queryActive = elements.search.value.trim().length > 0;
    elements.counter.textContent = queryActive
      ? `Найдено: ${pluralizeTasks(visibleTasks.length)}`
      : tasks.length === 0
        ? 'Нет задач'
        : `${pluralizeTasks(tasks.length)}, выполнено: ${completed}`;

    elements.emptyState.hidden = visibleTasks.length !== 0;
    elements.list.hidden = visibleTasks.length === 0;
    elements.emptyTitle.textContent = queryActive ? 'Ничего не найдено' : 'Задач пока нет';
    elements.emptyText.textContent = queryActive
      ? 'Попробуйте изменить поисковый запрос.'
      : 'Добавьте первую задачу — и начните двигаться к цели.';

    if (focusTaskId) {
      const target = [...elements.list.querySelectorAll('[data-action="toggle"]')]
        .find((checkbox) => checkbox.dataset.taskId === focusTaskId);
      target?.focus();
    }
  }

  function announce(message) {
    elements.liveRegion.textContent = '';
    window.setTimeout(() => { elements.liveRegion.textContent = message; }, 30);
  }

  function openDialog(task = null, trigger = document.activeElement) {
    editingId = task?.id ?? null;
    dialogTrigger = trigger instanceof HTMLElement ? trigger : elements.addButton;
    elements.dialogTitle.textContent = task ? 'Редактировать задачу' : 'Новая задача';
    elements.submitButton.textContent = task ? 'Сохранить' : 'Добавить';
    elements.titleInput.value = task?.title ?? '';
    elements.formError.textContent = '';
    elements.titleInput.removeAttribute('aria-invalid');
    elements.dialog.showModal();
    window.requestAnimationFrame(() => elements.titleInput.focus());
  }

  function closeDialog() {
    if (elements.dialog.open) elements.dialog.close();
  }

  function validateTitle() {
    const title = elements.titleInput.value.trim();
    if (!title) {
      elements.formError.textContent = 'Введите название задачи.';
      elements.titleInput.setAttribute('aria-invalid', 'true');
      elements.titleInput.focus();
      return null;
    }
    elements.formError.textContent = '';
    elements.titleInput.removeAttribute('aria-invalid');
    return title;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const title = validateTitle();
    if (!title) return;

    if (editingId) {
      const task = tasks.find((item) => item.id === editingId);
      if (task) {
        task.title = title;
        saveTasks();
        render();
        announce(`Задача «${title}» изменена.`);
      }
    } else {
      tasks.push({ id: createId(), title, done: false });
      saveTasks();
      render();
      announce(`Задача «${title}» добавлена.`);
    }
    closeDialog();
  }

  function handleDelete(id) {
    const visibleBefore = getVisibleTasks();
    const deletedIndex = visibleBefore.findIndex((task) => task.id === id);
    const deletedTask = tasks.find((task) => task.id === id);
    const focusCandidate = visibleBefore[deletedIndex + 1] ?? visibleBefore[deletedIndex - 1] ?? null;
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    render();
    if (focusCandidate && tasks.some((task) => task.id === focusCandidate.id)) {
      const checkbox = [...elements.list.querySelectorAll('[data-action="toggle"]')]
        .find((element) => element.dataset.taskId === focusCandidate.id);
      checkbox?.focus();
    } else {
      elements.addButton.focus();
    }
    announce(`Задача «${deletedTask?.title ?? ''}» удалена.`);
  }

  function handleListClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const task = tasks.find((item) => item.id === button.dataset.taskId);
    if (!task) return;
    if (button.dataset.action === 'edit') openDialog(task, button);
    if (button.dataset.action === 'delete') handleDelete(task.id);
  }

  function handleToggle(event) {
    const checkbox = event.target.closest('input[data-action="toggle"]');
    if (!checkbox) return;
    const task = tasks.find((item) => item.id === checkbox.dataset.taskId);
    if (!task) return;
    task.done = checkbox.checked;
    saveTasks();
    render({ focusTaskId: task.id });
    announce(`Задача «${task.title}» ${task.done ? 'выполнена' : 'возвращена в работу'}.`);
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = theme;
    elements.themeButton.setAttribute('aria-pressed', String(isDark));
    elements.themeLabel.textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
  }

  function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { localStorage.setItem(THEME_KEY, nextTheme); } catch { /* The UI still works without storage. */ }
    announce(`Включена ${nextTheme === 'dark' ? 'тёмная' : 'светлая'} тема.`);
  }

  elements.addButton.addEventListener('click', () => openDialog());
  elements.list.addEventListener('click', handleListClick);
  elements.list.addEventListener('change', handleToggle);
  elements.search.addEventListener('input', () => render());
  elements.themeButton.addEventListener('click', toggleTheme);
  elements.form.addEventListener('submit', handleSubmit);
  document.querySelector('.js-close-dialog').addEventListener('click', closeDialog);
  document.querySelector('.js-cancel-dialog').addEventListener('click', closeDialog);
  elements.titleInput.addEventListener('input', () => {
    if (elements.titleInput.value.trim()) {
      elements.formError.textContent = '';
      elements.titleInput.removeAttribute('aria-invalid');
    }
  });
  elements.dialog.addEventListener('close', () => {
    elements.form.reset();
    editingId = null;
    if (dialogTrigger?.isConnected) dialogTrigger.focus();
    else elements.addButton.focus();
    dialogTrigger = null;
  });
  elements.dialog.addEventListener('click', (event) => {
    if (event.target === elements.dialog) closeDialog();
  });

  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  render();
})();
