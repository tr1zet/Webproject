export function applyPipeline<Input, Result>(
  value: Input,
  first: (value: Input) => Result
): Result;
export function applyPipeline<Input, FirstResult, Result>(
  value: Input,
  first: (value: Input) => FirstResult,
  second: (value: FirstResult) => Result
): Result;
export function applyPipeline<Input, FirstResult, SecondResult, Result>(
  value: Input,
  first: (value: Input) => FirstResult,
  second: (value: FirstResult) => SecondResult,
  third: (value: SecondResult) => Result
): Result;
export function applyPipeline(
  value: unknown,
  first: (value: never) => unknown,
  second?: (value: never) => unknown,
  third?: (value: never) => unknown
): unknown {
  let result: unknown = value;
  const steps = [first, second, third];

  for (const step of steps) {
    if (step) {
      result = step(result as never);
    }
  }

  return result;
}

const oneStep = applyPipeline(5, (value) => value * 2);
const twoSteps = applyPipeline(5, (value) => value * 2, (value) => `Результат: ${value}`);
const threeSteps = applyPipeline(
  5,
  (value) => value * 2,
  (value) => `Результат: ${value}`,
  (value) => value.toUpperCase()
);

console.log('Один шаг:', oneStep);
console.log('Два шага:', twoSteps);
console.log('Три шага:', threeSteps);
