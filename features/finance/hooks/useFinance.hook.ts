'use client';
import { useState } from 'react';
import { useBudget }   from '@/features/budgets/hooks/useBudget.hook';
import { useNetWorth } from '@/features/networth/hooks/useNetWorth.hook';
import { firstOfMonth, nowISO, type Tab, type NetworthFilter } from '../finance.types';

export function useFinance() {
  const budgetHook   = useBudget();
  const networthHook = useNetWorth();

  const [activeTab,        setActiveTab]        = useState<Tab>('budget');
  const [editBudgetCat,    setEditBudgetCat]    = useState<string | null>(null);
  const [editBudgetAmt,    setEditBudgetAmt]    = useState('');
  const [confirmPayCat,    setConfirmPayCat]    = useState<string | null>(null);
  const [confirmPayAmt,    setConfirmPayAmt]    = useState('');
  const [confirmPayDate,   setConfirmPayDate]   = useState('');
  const [budgetDetail,     setBudgetDetail]     = useState<typeof budgetHook.budgets[0] | null>(null);
  const [addNetworthOpen,  setAddNetworthOpen]  = useState(false);
  const [addNetworthForm,  setAddNetworthForm]  = useState({ month: firstOfMonth(), amount: '', notes: '' });
  const [editNetworth,     setEditNetworth]     = useState<{ id: number; month: string; amount: string; notes: string } | null>(null);
  const [confirm,          setConfirm]          = useState<{ msg: string; action: () => void } | null>(null);
  const [networthFilter,   setNetworthFilter]   = useState<NetworthFilter>('all');
  const [showNetworthFilter, setShowNetworthFilter] = useState(false);
  const [infoBudget,       setInfoBudget]       = useState(false);
  const [infoNetworth,     setInfoNetworth]     = useState(false);

  const totalBudget = budgetHook.budgets.reduce((s, b) => s + parseFloat(b.monthly_amount), 0);
  const totalSpent  = budgetHook.budgets.reduce((s, b) => s + parseFloat(b.spent_this_month), 0);
  const overallPct  = totalBudget > 0 ? Math.min(1, totalSpent / totalBudget) : 0;

  const filteredEntries = networthHook.entries.filter(e => {
    if (networthFilter === 'all')       return true;
    if (networthFilter === 'real')      return e.is_actual;
    if (networthFilter === 'meta')      return e.goal_reached;
    if (networthFilter === 'projected') return !e.is_actual && !e.goal_reached;
    return true;
  });

  function openConfirmPay(cat: string, amt: string) {
    setConfirmPayCat(cat); setConfirmPayAmt(amt); setConfirmPayDate(nowISO());
  }
  async function submitConfirmPay() {
    if (!confirmPayCat || !confirmPayAmt) return;
    await budgetHook.confirmPayment(confirmPayCat, parseFloat(confirmPayAmt), confirmPayDate);
    setConfirmPayCat(null);
  }
  async function submitEditBudget() {
    if (!editBudgetCat || !editBudgetAmt) return;
    await budgetHook.updateBudget(editBudgetCat, parseFloat(editBudgetAmt));
    setEditBudgetCat(null);
  }
  async function submitAddNetworth() {
    if (!addNetworthForm.amount) return;
    await networthHook.addEntry({ month: addNetworthForm.month, amount: parseFloat(addNetworthForm.amount), notes: addNetworthForm.notes || undefined });
    setAddNetworthForm({ month: firstOfMonth(), amount: '', notes: '' });
    setAddNetworthOpen(false);
  }
  async function submitEditNetworth() {
    if (!editNetworth?.amount) return;
    await networthHook.updateEntry(editNetworth.id, { month: editNetworth.month, amount: parseFloat(editNetworth.amount), notes: editNetworth.notes || undefined });
    setEditNetworth(null);
  }

  return {
    budgetHook, networthHook,
    activeTab, setActiveTab,
    editBudgetCat, setEditBudgetCat, editBudgetAmt, setEditBudgetAmt,
    confirmPayCat, setConfirmPayCat, confirmPayAmt, setConfirmPayAmt, confirmPayDate, setConfirmPayDate,
    budgetDetail, setBudgetDetail,
    addNetworthOpen, setAddNetworthOpen, addNetworthForm, setAddNetworthForm,
    editNetworth, setEditNetworth,
    confirm, setConfirm,
    networthFilter, setNetworthFilter, showNetworthFilter, setShowNetworthFilter,
    infoBudget, setInfoBudget, infoNetworth, setInfoNetworth,
    totalBudget, totalSpent, overallPct, filteredEntries,
    openConfirmPay, submitConfirmPay, submitEditBudget, submitAddNetworth, submitEditNetworth,
  };
}

export type FinanceCtx = ReturnType<typeof useFinance>;
