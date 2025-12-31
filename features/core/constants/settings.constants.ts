import type { UserSettings } from '../../settings/types/settings.types';

export const emptyUserSettings: UserSettings = {
  id: '',
  name: '',
  age: 0,
  currency: 'USD',
  createdAt: new Date(),
  updatedAt: new Date(),
};
