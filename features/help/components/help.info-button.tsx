'use client';

import { Info } from 'lucide-react';
import type { HelpContext } from '../types/help.types';

interface InfoButtonProps {
  context: HelpContext;
  onClick: (context: HelpContext) => void;
}

export function InfoButton({ context, onClick }: InfoButtonProps) {
  return (
    <button
      onClick={() => onClick(context)}
      className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200"
      aria-label="Show information"
      type="button"
    >
      <Info size={16} />
    </button>
  );
}
