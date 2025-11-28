import Dexie, { Table } from 'dexie';
import { UIElement } from '../types/element';

export interface Design {
  id?: number;
  name: string;
  elements: UIElement[];
  selectedElementId: string | null;
  createdAt: number;
  updatedAt: number;
}

export class AhuraDatabase extends Dexie {
  designs!: Table<Design>;

  constructor() {
    super('AhuraDatabase');
    this.version(1).stores({
      designs: '++id, name, createdAt, updatedAt',
    });
  }
}

export const db = new AhuraDatabase();

