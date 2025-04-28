import { Contract } from "./contract";

export interface Payment {
  id?: number;
  amount: number;
  date?: Date;
  status?: 'PENDING' | 'SUCCEEDED' | 'FAILED';
  contract?: Contract}