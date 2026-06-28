'use client';
import { useState } from 'react';
import { useBudget }   from '@/features/budgets/hooks/useBudget.hook';
import { useNetWorth } from '@/features/networth/hooks/useNetWorth.hook';
import { firstOfMonth, nowISO, type Tab, type NetworthFilter } from '../finance.types';

export function useFinance() {
  const budgetHook   = useBudget();
  const networthHook = useNetWorth();

  const [activeTab,          setActiveTab]          = useState<Tab>('budget');
  const [editBudgetCat,      setEditBudgetCat]      = useState<string | null>(null);
  const [editBudgetAmt,      setEditBudgetAmt]      = useState('');
  const [confirmPayCat,      setConfirmPayCat]      = useState<string | null>(null);
  const [confirmPayAmt,      setConfirmPayAmt]      = useState('');
  const [confirmPayDate,     setConfirmPayDate]     = useState('');
  const [bolsilloDetail,     setBolsilloDetail]     = useState<typeof budgetHook.budgets[0] | null>(null);
  const [addNetworthOpen,    setAddNetworthOpen]    = useState(false);
  const [addNetworthForm,    setAddNetworthForm]    = useState({ month: firstOfMonth().slice(0, 7), amount: '', notes: '' });
  const [editNetworth,       setEditNetworth]       = useState<{ id: number; month: string; amount: string; notes: string } | null>(null);
  const [confirm,            setConfirm]            = useState<{ msg: string; action: () => void } | null>(null);
  const [networthFilter,     setNetworthFilter]     = useState<NetworthFilter>('all');
  const [showNetworthFilter, setShowNetworthFilter] = useState(false);
  const [addBudgetOpen,      setAddBudgetOpen]      = useState(false);
  const [addBudgetCat,       setAddBudgetCat]       = useState<string>('');
  const [addBudgetAmt,       setAddBudgetAmt]       = useState('');
  const [infoBudget,         setInfoBudget]         = useState(false);
  const [infoNetworth,       setInfoNetworth]       = useState(false);

  // Savings projection
  const actualEntries = networthHook.entries.filter(e => e.is_actual);
  const currentSaved  = actualEntries.length > 0
    ? parseFloat(actualEntries[actualEntries.length - 1].amount) : 0;
  const avgMonthlySavings = actualEntries.length >= 2
    ? (parseFloat(actualEntries[actualEntries.length - 1].amount) - parseFloat(actualEntries[0].amount)) / (actualEntries.length - 1)
    : budgetHook.monthlySavingsTarget;
  const monthsRemaining = (avgMonthlySavings > 0 && budgetHook.goalAmount > currentSaved)
    ? Math.ceil((budgetHook.goalAmount - currentSaved) / avgMonthlySavings) : null;

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
  async function submitAddBudget() {
    if (!addBudgetCat || !addBudgetAmt) return;
    await budgetHook.createBudget(addBudgetCat, parseFloat(addBudgetAmt));
    setAddBudgetOpen(false); setAddBudgetCat(''); setAddBudgetAmt('');
  }
  async function submitEditBudget() {
    if (!editBudgetCat || !editBudgetAmt) return;
    await budgetHook.updateBudget(editBudgetCat, parseFloat(editBudgetAmt));
    setEditBudgetCat(null);
  }
  async function submitAddNetworth() {
    if (!addNetworthForm.amount) return;
    await networthHook.addEntry({ month: addNetworthForm.month, amount: parseFloat(addNetworthForm.amount), notes: addNetworthForm.notes || undefined });
    setAddNetworthForm({ month: firstOfMonth().slice(0, 7), amount: '', notes: '' });
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
    addBudgetOpen, setAddBudgetOpen, addBudgetCat, setAddBudgetCat, addBudgetAmt, setAddBudgetAmt, submitAddBudget,
    createBudget: budgetHook.createBudget, deleteBudget: budgetHook.deleteBudget,
    bolsilloDetail, setBolsilloDetail,
    addNetworthOpen, setAddNetworthOpen, addNetworthForm, setAddNetworthForm,
    editNetworth, setEditNetworth,
    confirm, setConfirm,
    networthFilter, setNetworthFilter, showNetworthFilter, setShowNetworthFilter,
    infoBudget, setInfoBudget, infoNetworth, setInfoNetworth,
    filteredEntries,
    spendingCap:       budgetHook.spendingCap,
    totalRealExpenses: budgetHook.totalRealExpenses,
    surplusSavings:    budgetHook.surplusSavings,
    currentSaved, monthsRemaining, goalAmount: budgetHook.goalAmount,
    openConfirmPay, submitConfirmPay, submitEditBudget, submitAddNetworth, submitEditNetworth,
  };
}

export type FinanceCtx = ReturnType<typeof useFinance>;
