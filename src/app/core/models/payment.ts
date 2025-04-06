import { Contract } from "./contract";

export interface Payment {
  id?: number;
  amount: number;
  date?: Date;
  status?: 'PENDING' | 'COMPLETED' | 'FAILED';
  contract?: Contract}