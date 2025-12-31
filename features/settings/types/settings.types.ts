import type { ObjectId } from 'mongodb';

export interface UserSettings {
  id: string;
  name: string;
  age: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettingsDocument {
  _id: ObjectId;
  name: string;
  age: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}
