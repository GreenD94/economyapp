'use client';
import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/features/core/utils/api.client';
import type { WishlistItemFromAPI } from '@/features/core/types/api.types';

export function useWishlist() {
  const [items, setItems] = useState<WishlistItemFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    apiGet<WishlistItemFromAPI[]>('/api/v1/wishlist')
      .then(setItems)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function addItem(body: { item: string; price: string; priority: string; notes?: string }) {
    await apiPost('/api/v1/wishlist', body);
    load();
  }

  async function updateItem(id: number, body: { item?: string; price?: string; priority?: string; notes?: string; status?: string }) {
    await apiPut(`/api/v1/wishlist/${id}`, body);
    load();
  }

  async function markBought(id: number) {
    await apiPut(`/api/v1/wishlist/${id}`, { status: 'Comprado' });
    load();
  }

  async function markDescartado(id: number) {
    await apiPut(`/api/v1/wishlist/${id}`, { status: 'Descartado' });
    load();
  }

  async function deleteItem(id: number) {
    await apiDelete(`/api/v1/wishlist/${id}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return { items, loading, error, addItem, updateItem, markBought, markDescartado, deleteItem };
}
