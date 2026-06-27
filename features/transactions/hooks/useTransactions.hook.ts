'use client';
import { useState } from 'react';
import { useIncomes } from '@/features/incomes/hooks/useIncomes.hook';
import { useIncomeSources } from '@/features/incomes/hooks/useIncomeSources.hook';
import { useExpenses } from '@/features/expenses/hooks/useExpenses.hook';
import { useExpenseSourceActions } from './useExpenseSourceActions.hook';
import type { IncomeFromAPI, ExpenseFromAPI, IncomeSourceFromAPI } from '@/features/core/types/api.types';
import {
  nowISO, EMPTY_INCOME, EMPTY_EXPENSE, EMPTY_SOURCE,
  type Tab, type IncomeForm, type ExpenseForm, type SourceForm,
  type ConfirmSrcState, type ConfirmState, type UnconfirmState,
} from '../transactions.types';

export function useTransactions() {
  const incomeHook  = useIncomes();
  const sourcesHook = useIncomeSources();
  const expenseHook = useExpenses();
  const expSrcActions = useExpenseSourceActions(expenseHook);

  const [activeTab, setActiveTab] = useState<Tab>('incomes');
  const [confirm,      setConfirm]      = useState<ConfirmState | null>(null);
  const [infoIncomes,  setInfoIncomes]  = useState(false);
  const [infoExpenses, setInfoExpenses] = useState(false);

  // Unconfirm modal
  const [unconfirmModal, setUnconfirmModal] = useState<UnconfirmState | null>(null);

  // Detail sheets
  const [sourceDetail,  setSourceDetail]  = useState<IncomeSourceFromAPI | null>(null);
  const [incomeDetail,  setIncomeDetail]  = useState<IncomeFromAPI | null>(null);
  const [expenseDetail, setExpenseDetail] = useState<ExpenseFromAPI | null>(null);

  // Source modals
  const [confirmSrcModal,  setConfirmSrcModal]  = useState<ConfirmSrcState | null>(null);
  const [addSourceOpen,    setAddSourceOpen]    = useState(false);
  const [sourceForm,       setSourceForm]       = useState<SourceForm>(EMPTY_SOURCE);
  const [editSourceModal,  setEditSourceModal]  = useState<IncomeSourceFromAPI | null>(null);
  const [editSourceForm,   setEditSourceForm]   = useState<SourceForm>(EMPTY_SOURCE);

  // Income entry modals (Otros ingresos)
  const [addIncomeOpen,   setAddIncomeOpen]   = useState(false);
  const [incomeForm,      setIncomeForm]      = useState<IncomeForm>(EMPTY_INCOME);
  const [editIncome,      setEditIncome]      = useState<IncomeFromAPI | null>(null);
  const [editIncomeForm,  setEditIncomeForm]  = useState<IncomeForm>(EMPTY_INCOME);
  const [editIncomeNote,  setEditIncomeNote]  = useState('');

  // Expense modals
  const [addExpenseOpen,  setAddExpenseOpen]  = useState(false);
  const [expenseForm,     setExpenseForm]     = useState<ExpenseForm>(() => ({ ...EMPTY_EXPENSE, date: nowISO() }));
  const [editExpense,     setEditExpense]     = useState<ExpenseFromAPI | null>(null);
  const [editExpenseForm, setEditExpenseForm] = useState<ExpenseForm>(EMPTY_EXPENSE);
  const [editExpenseNote, setEditExpenseNote] = useState('');

  // Computed
  const totalExpected  = sourcesHook.sources.reduce((s, src) => s + parseFloat(src.monthly_equivalent), 0);
  const totalConfirmed = incomeHook.incomes.reduce((s, i) => s + parseFloat(i.amount), 0);
  const manualIncomes  = incomeHook.incomes.filter(i => i.source_id === null);
  const totalExpense   = expenseHook.expenses.reduce((s, e) => s + parseFloat(e.amount), 0);

  function confirmedEntry(sourceId: number) {
    return incomeHook.incomes.find(i => i.source_id === sourceId) ?? null;
  }

  // Actions — unconfirm
  function openUnconfirmSrc(src: IncomeSourceFromAPI, entry: IncomeFromAPI, slotIndex: number, totalSlots: number) {
    setUnconfirmModal({ entry, source: src, note: '', slotIndex, totalSlots });
  }
  async function submitUnconfirm() {
    if (!unconfirmModal || !unconfirmModal.note.trim()) return;
    await incomeHook.unconfirmIncome(unconfirmModal.entry.id, unconfirmModal.note.trim());
    setUnconfirmModal(null);
  }

  // Actions — source
  function openConfirmSrc(src: IncomeSourceFromAPI, slotIndex: number, totalSlots: number) {
    setConfirmSrcModal({ source: src, amount: src.base_amount ?? '', date: nowISO(), slotIndex, totalSlots });
  }
  async function submitConfirmSrc() {
    if (!confirmSrcModal || !(parseFloat(confirmSrcModal.amount) > 0)) return;
    const { source, amount, date } = confirmSrcModal;
    await incomeHook.addIncome({ date, source: source.label, amount, type: source.income_type === 'fixed' ? 'Fijo' : 'Variable', source_id: source.id, notes: null });
    setConfirmSrcModal(null);
  }
  function openEditSource(src: IncomeSourceFromAPI) {
    setEditSourceModal(src);
    setEditSourceForm({ label: src.label, income_type: src.income_type, frequency: src.frequency, base_amount: src.base_amount ?? '', due_day: src.due_day, note: '' });
  }
  async function submitEditSource() {
    if (!editSourceModal || !editSourceForm.label) return;
    await sourcesHook.updateSource(editSourceModal.id, {
      label: editSourceForm.label, income_type: editSourceForm.income_type,
      frequency: editSourceForm.frequency,
      base_amount: parseFloat(editSourceForm.base_amount) || null,
      due_day: editSourceForm.due_day,
      note: editSourceForm.note || null,
    });
    setEditSourceModal(null); setEditSourceForm(EMPTY_SOURCE);
  }
  async function handleAddSource() {
    if (!sourceForm.label) return;
    await sourcesHook.addSource({ label: sourceForm.label, income_type: sourceForm.income_type, frequency: sourceForm.frequency, base_amount: parseFloat(sourceForm.base_amount) || null, due_day: sourceForm.due_day });
    setAddSourceOpen(false); setSourceForm(EMPTY_SOURCE);
  }

  // Actions — income entries
  async function submitAddIncome() {
    if (!incomeForm.source || !incomeForm.amount) return;
    await incomeHook.addIncome({ date: incomeForm.date, source: incomeForm.source, amount: incomeForm.amount, type: incomeForm.type, source_id: null, notes: null });
    setIncomeForm(EMPTY_INCOME); setAddIncomeOpen(false);
  }
  async function submitEditIncome() {
    if (!editIncome) return;
    await incomeHook.updateIncome(editIncome.id, { date: editIncomeForm.date, source: editIncomeForm.source, amount: editIncomeForm.amount, type: editIncomeForm.type, note: editIncomeNote || null });
    setEditIncome(null); setEditIncomeNote('');
  }

  // Actions — expenses
  async function submitAddExpense() {
    if (!expenseForm.description || !expenseForm.amount) return;
    await expenseHook.addExpense({ source_id: null, date: expenseForm.date, category: expenseForm.category, description: expenseForm.description, amount: expenseForm.amount, type: expenseForm.type });
    setExpenseForm({ ...EMPTY_EXPENSE, date: nowISO() }); setAddExpenseOpen(false);
  }
  async function submitEditExpense() {
    if (!editExpense) return;
    await expenseHook.updateExpense(editExpense.id, { date: editExpenseForm.date, category: editExpenseForm.category, description: editExpenseForm.description, amount: editExpenseForm.amount, type: editExpenseForm.type, note: editExpenseNote || null });
    setEditExpense(null); setEditExpenseNote('');
  }

  return {
    incomeHook, sourcesHook, expenseHook,
    activeTab, setActiveTab,
    confirm, setConfirm,
    infoIncomes, setInfoIncomes, infoExpenses, setInfoExpenses,
    unconfirmModal, setUnconfirmModal, openUnconfirmSrc, submitUnconfirm,
    confirmSrcModal, setConfirmSrcModal, openConfirmSrc, submitConfirmSrc,
    addSourceOpen, setAddSourceOpen, sourceForm, setSourceForm, handleAddSource,
    editSourceModal, setEditSourceModal, editSourceForm, setEditSourceForm, openEditSource, submitEditSource,
    addIncomeOpen, setAddIncomeOpen, incomeForm, setIncomeForm, submitAddIncome,
    editIncome, setEditIncome, editIncomeForm, setEditIncomeForm, editIncomeNote, setEditIncomeNote, submitEditIncome,
    addExpenseOpen, setAddExpenseOpen, expenseForm, setExpenseForm, submitAddExpense,
    editExpense, setEditExpense, editExpenseForm, setEditExpenseForm, editExpenseNote, setEditExpenseNote, submitEditExpense,
    sourceDetail, setSourceDetail,
    incomeDetail, setIncomeDetail,
    expenseDetail, setExpenseDetail,
    totalExpected, totalConfirmed, manualIncomes, totalExpense, confirmedEntry,
    ...expSrcActions,
  };
}

export type TransactionCtx = ReturnType<typeof useTransactions>;
