import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline/promises';

const FIRST_TASK = 1;
const LAST_TASK = 9;
let runId = 0;

async function runTask(taskNumber: number): Promise<void> {
  console.log(`\n========== Задание ${taskNumber} ==========`);
  await import(`./task${taskNumber}.js?run=${runId++}`);
}

function showMenu(): void {
  console.log('\nЛабораторная работа №8');
  console.log('Введите номер задания от 1 до 9.');
  console.log('a — запустить все задания');
  console.log('0 — выйти');
}

const terminal = createInterface({ input, output });

try {
  let shouldContinue = true;

  while (shouldContinue) {
    showMenu();
    const answer = (await terminal.question('Ваш выбор: ')).trim().toLowerCase();

    if (answer === '0' || answer === 'q' || answer === 'exit') {
      shouldContinue = false;
      continue;
    }

    if (answer === 'a' || answer === 'all') {
      for (let taskNumber = FIRST_TASK; taskNumber <= LAST_TASK; taskNumber += 1) {
        await runTask(taskNumber);
      }
      continue;
    }

    const taskNumber = Number(answer);
    if (Number.isInteger(taskNumber) && taskNumber >= FIRST_TASK && taskNumber <= LAST_TASK) {
      await runTask(taskNumber);
    } else {
      console.log('Неизвестная команда. Введите число от 1 до 9, «a» или «0».');
    }
  }
} finally {
  terminal.close();
}

console.log('Работа завершена.');
