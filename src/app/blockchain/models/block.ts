import * as CryptoJS from 'crypto-js';
import { ITransaction } from './transaction';

export interface IBlock {
  nonce: number;
  timestamp: Date | null;
  previousHash: string;
  hash: string;
  transactions: ITransaction[];
}