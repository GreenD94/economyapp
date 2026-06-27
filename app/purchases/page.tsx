import { Suspense } from 'react';
import { PurchasesContainer } from '@/features/purchases/containers/Purchases.container';

export default function PurchasesPage() {
  return (
    <Suspense>
      <PurchasesContainer />
    </Suspense>
  );
}
