import { Suspense } from 'react';
import { TransactionsContainer } from '@/features/transactions/containers/Transactions.container';

export default function TransactionsPage() {
  return (
    <Suspense>
      <TransactionsContainer />
    </Suspense>
  );
}
