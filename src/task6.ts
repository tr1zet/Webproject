export type Invoice = {
  id: string;
  amount: number;
  status: 'paid' | 'free';
};

export function sumByStatus(invoices: readonly Invoice[]): { paid: number; free: number } {
  return invoices.reduce(
    (totals, invoice) => ({
      ...totals,
      [invoice.status]: totals[invoice.status] + invoice.amount
    }),
    { paid: 0, free: 0 }
  );
}

const invoices: readonly Invoice[] = [
  { id: 'invoice-1', amount: 1200, status: 'paid' },
  { id: 'invoice-2', amount: 300, status: 'free' },
  { id: 'invoice-3', amount: 800, status: 'paid' },
  { id: 'invoice-4', amount: 150, status: 'free' }
];

console.log('Смешанный набор:', sumByStatus(invoices));
console.log('Пустой массив:', sumByStatus([]));
console.log('Исходные данные:', invoices);
