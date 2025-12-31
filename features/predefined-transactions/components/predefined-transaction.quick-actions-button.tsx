'use client';

import { Zap } from 'lucide-react';

interface QuickActionsButtonProps {
  onClick: () => void;
}

export function QuickActionsButton({ onClick }: QuickActionsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-32 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-transform active:scale-95 touch-manipulation"
      aria-label="Quick actions"
    >
      <Zap size={24} />
    </button>
  );
}
