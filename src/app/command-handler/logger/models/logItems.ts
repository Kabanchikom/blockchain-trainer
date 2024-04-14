import { ILogItem } from "./ILogItem";

export class TransactionCreated implements ILogItem {
    type = 'TransactionCreated';
    id = 0;
    hash = '';
    sender = '';
    reciever = '';
    amount = 0;
}

export class TransactionBroadcasted implements ILogItem {
    type = 'TransactionBroadcasted';
    id = 0;
    hash = '';
    sender = '';
}

export class TransactionRecieved implements ILogItem {
    type = 'TransactionRecieved';
    id = 0;
    hash = '';
    reciever = '';
}

export class TransactionEnblocked implements ILogItem {
    type = 'TransactionEnblocked';
    id = 0;
    transactionHash = '';
    actor = '';
}

export class BlockGenerated implements ILogItem {
    type = 'BlockGenerated';
    id = 0;
    hash = '';
    miner = '';
    reward = 0;
}

export class BlockBroadcasted implements ILogItem {
    type = 'BlockBroadcasted';
    id = 0;
    hash = '';
    sender = '';
}

export class BlockRecieved implements ILogItem {
    type = 'BlockRecieved';
    id = 0;
    hash = '';
    reciever = '';
}

export class BlockDiscarded implements ILogItem {
    type = 'BlockDiscarded';
    id = 0;
    hash = '';
    reciever = '';
    reason = '';
}