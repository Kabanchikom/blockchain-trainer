import { ITransaction } from './transaction';
import { ICoinbase } from './coinbase';

export interface IBlock {
  nonce: number;
  timestamp: Date | null;
  previousHash: string;
  hash: string;
  transactions: ITransaction[];
  coinbase: ICoinbase | null;
}