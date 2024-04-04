import { IBlock } from "./block";
import { Blockchain } from "./blockchain";
import { ITransaction } from "./transaction";

export interface INode {
    id: number;
    name: string;
    blockchain: Blockchain | null;
    newBlock: IBlock | null;
    transactionPool: ITransaction[];
    publicKey: string;
    privateKey: string;
}