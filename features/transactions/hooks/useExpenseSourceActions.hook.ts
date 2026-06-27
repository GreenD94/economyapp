'use client';
import { useState } from 'react';
import { useExpenseSources } from '@/features/expenses/hooks/useExpenseSources.hook';
import type { ExpenseFromAPI, ExpenseSourceFromAPI } from '@/features/core/types/api.types';
import type { useExpenses } from '@/features/expenses/hooks/useExpenses.hook';
import {
  nowISO, EMPTY_EXPENSE_SOURCE,
  type ExpenseSourceForm, type ConfirmExpenseSrcState, type UnconfirmExpenseState,
} from '../transactions.types';

type ExpenseHook = ReturnType<typeof useExpenses>;

export function useExpenseSourceActions(expenseHook: ExpenseHook) {
  const expenseSourcesHook = useExpenseSources();

  const [expenseSourceDetail,    setExpenseSourceDetail]    = useState<ExpenseSourceFromAPI | null>(null);
  const [confirmExpenseSrcModal, setConfirmExpenseSrcModal] = useState<ConfirmExpenseSrcState | null>(null);
  const [addExpenseSourceOpen,   setAddExpenseSourceOpen]   = useState(false);
  const [expenseSourceForm,      setExpenseSourceForm]      = useState<ExpenseSourceForm>(EMPTY_EXPENSE_SOURCE);
  const [editExpenseSourceModal, setEditExpenseSourceModal] = useState<ExpenseSourceFromAPI | null>(null);
  const [editExpenseSourceForm,  setEditExpenseSourceForm]  = useState<ExpenseSourceForm>(EMPTY_EXPENSE_SOURCE);

  function confirmedExpenseEntries(sourceId: number): ExpenseFromAPI[] {
    return expenseHook.allExpenses.filter(e => e.source_id === sourceId);
  }

  const totalExpectedExpenses  = expenseSourcesHook.sources.reduce((s, src) => s + parseFloat(src.monthly_equivalent), 0);
  const totalConfirmedExpenses = expenseHook.allExpenses.filter(e => e.source_id !== null).reduce((s, e) => s + parseFloat(e.amount), 0);
  const manualExpenses         = expenseHook.expenses.filter(e => e.source_id === null);

  function openConfirmExpenseSrc(src: ExpenseSourceFromAPI, slotIndex: number, totalSlots: number) {
    setConfirmExpenseSrcModal({ source: src, amount: src.base_amount ?? '', date: nowISO(), slotIndex, totalSlots });
  }

  async function submitConfirmExpenseSrc() {
    if (!confirmExpenseSrcModal || !(parseFloat(confirmExpenseSrcModal.amount) > 0)) return;
    const { source, amount, date } = confirmExpenseSrcModal;
    await expenseHook.addExpense({ source_id: source.id, date, category: source.category, description: source.label, amount, type: source.classification });
    setConfirmExpenseSrcModal(null);
  }

  function openEditExpenseSource(src: ExpenseSourceFromAPI) {
    setEditExpenseSourceModal(src);
    setEditExpenseSourceForm({ label: src.label, category: src.category, classification: src.classification, expense_type: src.expense_type, frequency: src.frequency, base_amount: src.base_amount ?? '', due_day: src.due_day, note: '' });
  }

  async function submitEditExpenseSource() {
    if (!editExpenseSourceModal || !editExpenseSourceForm.label) return;
    await expenseSourcesHook.updateSource(editExpenseSourceModal.id, {
      label: editExpenseSourceForm.label, category: editExpenseSourceForm.category,
      classification: editExpenseSourceForm.classification, expense_type: 'variable',
      frequency: editExpenseSourceForm.frequency,
      base_amount: parseFloat(editExpenseSourceForm.base_amount) || null,
      due_day: editExpenseSourceForm.due_day,
    });
    setEditExpenseSourceModal(null); setEditExpenseSourceForm(EMPTY_EXPENSE_SOURCE);
  }

  async function handleAddExpenseSource() {
    if (!expenseSourceForm.label) return;
    await expenseSourcesHook.addSource({
      label: expenseSourceForm.label, category: expenseSourceForm.category,
      classification: expenseSourceForm.classification, expense_type: 'variable',
      frequency: expenseSourceForm.frequency,
      base_amount: parseFloat(expenseSourceForm.base_amount) || null,
      due_day: expenseSourceForm.due_day,
    });
    setAddExpenseSourceOpen(false); setExpenseSourceForm(EMPTY_EXPENSE_SOURCE);
  }

  const [unconfirmExpenseModal, setUnconfirmExpenseModal] = useState<UnconfirmExpenseState | null>(null);

  function openUnconfirmExpenseEntry(entry: ExpenseFromAPI, src: ExpenseSourceFromAPI, slotIndex: number, totalSlots: number) {
    setUnconfirmExpenseModal({ entry, source: src, note: '', slotIndex, totalSlots });
  }

  async function submitUnconfirmExpense() {
    if (!unconfirmExpenseModal) return;
    const words = unconfirmExpenseModal.note.trim().split(/\s+/).filter(Boolean);
    if (words.length < 2) return;
    await expenseHook.unconfirmExpense(unconfirmExpenseModal.entry.id, unconfirmExpenseModal.note.trim());
    setUnconfirmExpenseModal(null);
  }

  return {
    expenseSourcesHook,
    expenseSourceDetail, setExpenseSourceDetail,
    confirmExpenseSrcModal, setConfirmExpenseSrcModal, openConfirmExpenseSrc, submitConfirmExpenseSrc,
    addExpenseSourceOpen, setAddExpenseSourceOpen, expenseSourceForm, setExpenseSourceForm, handleAddExpenseSource,
    editExpenseSourceModal, setEditExpenseSourceModal, editExpenseSourceForm, setEditExpenseSourceForm,
    openEditExpenseSource, submitEditExpenseSource,
    unconfirmExpenseModal, setUnconfirmExpenseModal, openUnconfirmExpenseEntry, submitUnconfirmExpense,
    totalExpectedExpenses, totalConfirmedExpenses, manualExpenses,
    confirmedExpenseEntries,
  };
}
