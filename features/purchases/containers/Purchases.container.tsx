'use client';
import { useState } from 'react';
import { WishlistContainer } from '@/features/wishlist/containers/Wishlist.container';
import { DecisionContainer } from '@/features/decision/containers/Decision.container';
import styles from '../styles/Purchases.module.css';

type Tab = 'wishlist' | 'decision';

export function PurchasesContainer() {
  const [activeTab, setActiveTab] = useState<Tab>('wishlist');

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'wishlist' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          Wishlist
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'decision' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('decision')}
        >
          Decisor
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === 'wishlist' && <WishlistContainer />}
        {activeTab === 'decision'  && <DecisionContainer />}
      </div>
    </div>
  );
}
