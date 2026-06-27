import { Suspense } from 'react';
import { FinanceContainer } from '@/features/finance/containers/Finance.container';

export default function FinancePage() {
  return (
    <Suspense>
      <FinanceContainer />
    </Suspense>
  );
}
