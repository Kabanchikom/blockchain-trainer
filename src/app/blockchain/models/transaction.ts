import { ITransactionData } from "./transactionData";

export interface ITransaction {
    id: number;
    publicKey: string;
    hash: string;
    signature: string;
    data: ITransactionData
}