'use client';

import { useState, useEffect } from 'react';
import type { UserSettings } from '../types/settings.types';

interface SettingsFormProps {
  initialData?: UserSettings;
  onSubmit: (data: Partial<Omit<UserSettings, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  isLoading?: boolean;
}

export function SettingsForm({
  initialData,
  onSubmit,
  isLoading,
}: SettingsFormProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAge(initialData.age.toString());
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber < 0) {
      return;
    }

    onSubmit({
      name,
      age: ageNumber,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          type="number"
          min="0"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Your age"
        />
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Currency:</strong> USD (United States Dollar)
        </p>
        <p className="mt-1 text-xs text-blue-600">
          Currency is fixed to USD for this app
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}
