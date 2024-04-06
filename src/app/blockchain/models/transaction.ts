import { ITransactionData } from "./transactionData";

export interface ITransaction {
    publicKey: string;
    hash: string;
    signature: string;
    data: ITransactionData
}