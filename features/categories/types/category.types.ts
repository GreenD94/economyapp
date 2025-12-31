import type { ObjectId } from 'mongodb';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isPredefined: boolean;
  createdAt: Date;
}

export interface CategoryDocument {
  _id: ObjectId;
  name: string;
  icon: string;
  color: string;
  isPredefined: boolean;
  createdAt: Date;
}
