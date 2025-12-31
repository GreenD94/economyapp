'use client';

import type { PredefinedTransaction } from '../types/predefined-transaction.types';
import { formatCurrency } from '@/features/core/utils';
import { 
  DollarSign, Home, Zap, Droplet, Wifi, Phone, ShoppingCart, Fuel,
  type LucideIcon 
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'dollar-sign': DollarSign,
  'home': Home,
  'zap': Zap,
  'droplet': Droplet,
  'wifi': Wifi,
  'phone': Phone,
  'shopping-cart': ShoppingCart,
  'fuel': Fuel,
  'tag': DollarSign,
};

interface PredefinedTransactionButtonProps {
  transaction: PredefinedTransaction;
  onClick: (transaction: PredefinedTransaction) => void;
}

export function PredefinedTransactionButton({
  transaction,
  onClick,
}: PredefinedTransactionButtonProps) {
  const Icon = iconMap[transaction.icon] || DollarSign;
  const isEarning = transaction.type === 'earning';

  return (
    <button
      onClick={() => onClick(transaction)}
      className="flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 bg-white p-4 transition-all hover:border-blue-500 hover:bg-blue-50 active:scale-95 touch-manipulation"
      style={{ borderColor: transaction.color + '40' }}
    >
      <div
        className="rounded-full p-3"
        style={{ backgroundColor: transaction.color + '20' }}
      >
        <Icon size={24} style={{ color: transaction.color }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-900">{transaction.name}</p>
        {transaction.amount > 0 && (
          <p className={`text-xs font-medium ${isEarning ? 'text-green-600' : 'text-red-600'}`}>
            {isEarning ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </p>
        )}
        {transaction.amount === 0 && (
          <p className="text-xs text-gray-500">Set amount</p>
        )}
      </div>
    </button>
  );
}
