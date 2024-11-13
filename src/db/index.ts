import Dexie, { Table } from 'dexie';

export interface Organization {
  id?: number;
  name: string;
  contactPerson: string;
  email: string;
  createdAt: Date;
}

export interface FoodOrder {
  id?: number;
  organizationId: number;
  peopleServed: number;
  foodItems: string[];
  totalCost: number;
  orderDate: Date;
}

export interface Invoice {
  id?: number;
  organizationId: number;
  orderId: number;
  amount: number;
  status: 'paid' | 'pending';
  createdAt: Date;
}

export interface Expense {
  id?: number;
  description: string;
  amount: number;
  category: string;
  date: Date;
}

export class HotelDatabase extends Dexie {
  organizations!: Table<Organization>;
  foodOrders!: Table<FoodOrder>;
  invoices!: Table<Invoice>;
  expenses!: Table<Expense>;

  constructor() {
    super('HotelDB');
    this.version(1).stores({
      organizations: '++id, name, email',
      foodOrders: '++id, organizationId, orderDate',
      invoices: '++id, organizationId, orderId, status',
      expenses: '++id, category, date'
    });
  }
}

export const db = new HotelDatabase();