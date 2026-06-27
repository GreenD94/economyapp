'use client';
import { useState } from 'react';
import { useWishlist }  from './useWishlist.hook';
import { useCountUp }  from '@/features/core/hooks/useCountUp.hook';
import type { WishlistItemFromAPI } from '@/features/core/types/api.types';
import { EMPTY_FORM, verdictToColor, type ColorFilter, type FormState } from '../wishlist.types';

export function useWishlistState() {
  const { items, loading, error, addItem, updateItem, markBought, markDescartado, deleteItem } = useWishlist();

  const [colorFilter,    setColorFilter]    = useState<ColorFilter>('all');
  const [showFilters,    setShowFilters]    = useState(false);
  const [nameFilter,     setNameFilter]     = useState('');
  const [maxPrice,       setMaxPrice]       = useState('');
  const [priorityFilter, setPriorityFilter] = useState('Todas');

  const [addOpen,  setAddOpen]  = useState(false);
  const [addForm,  setAddForm]  = useState<FormState>(EMPTY_FORM);
  const [editItem, setEditItem] = useState<WishlistItemFromAPI | null>(null);
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);
  const [confirm,  setConfirm]  = useState<{ msg: string; label: string; action: () => void } | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const filtered = items.filter(item => {
    const color = verdictToColor(item.verdict);
    if (colorFilter !== 'all' && color !== colorFilter) return false;
    if (nameFilter && !item.item.toLowerCase().includes(nameFilter.toLowerCase())) return false;
    if (maxPrice && parseFloat(item.price) > parseFloat(maxPrice)) return false;
    if (priorityFilter !== 'Todas' && item.priority !== priorityFilter) return false;
    return true;
  });

  const countByColor: Record<string, number> = { green: 0, yellow: 0, red: 0, grey: 0 };
  items.forEach(it => { countByColor[verdictToColor(it.verdict)]++; });

  const pendingValue = items.filter(i => i.status === 'Pendiente').reduce((s, i) => s + parseFloat(i.price), 0);
  const countPending = useCountUp(loading ? 0 : pendingValue, 2000);

  async function handleAdd() {
    if (!addForm.item || !addForm.price) return;
    await addItem({ item: addForm.item, price: addForm.price, priority: addForm.priority, notes: addForm.notes || undefined });
    setAddForm(EMPTY_FORM); setAddOpen(false);
  }
  async function handleEdit() {
    if (!editItem || !editForm.item || !editForm.price) return;
    await updateItem(editItem.id, { item: editForm.item, price: editForm.price, priority: editForm.priority, notes: editForm.notes || undefined });
    setEditItem(null);
  }
  function openEdit(item: WishlistItemFromAPI) {
    setEditItem(item);
    setEditForm({ item: item.item, price: item.price, priority: item.priority, notes: item.notes ?? '' });
  }
  function askConfirm(msg: string, label: string, action: () => void) {
    setConfirm({ msg, label, action });
  }
  function getMenuItems(item: WishlistItemFromAPI) {
    const base = [
      { label: 'Editar', icon: 'edit', onClick: () => openEdit(item) },
      { label: 'Eliminar', icon: 'delete', danger: true, onClick: () => askConfirm('¿Eliminar este artículo permanentemente?', 'Eliminar', () => deleteItem(item.id)) },
    ];
    if (item.status === 'Pendiente') return [
      { label: 'Marcar comprado', icon: 'check_circle', onClick: () => askConfirm('¿Marcar como comprado?', 'Sí, compré', () => markBought(item.id)) },
      { label: 'Descartar', icon: 'cancel', onClick: () => askConfirm('¿Descartar este artículo?', 'Descartar', () => markDescartado(item.id)) },
      ...base,
    ];
    return base;
  }

  return {
    items, loading, error, filtered, countByColor, countPending,
    colorFilter, setColorFilter, showFilters, setShowFilters,
    nameFilter, setNameFilter, maxPrice, setMaxPrice,
    priorityFilter, setPriorityFilter,
    addOpen, setAddOpen, addForm, setAddForm, handleAdd,
    editItem, setEditItem, editForm, setEditForm, handleEdit,
    confirm, setConfirm, infoOpen, setInfoOpen,
    getMenuItems,
  };
}

export type WishlistCtx = ReturnType<typeof useWishlistState>;
