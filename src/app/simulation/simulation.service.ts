import { Injectable } from '@angular/core';
import { BlockchainService } from '../blockchain/blockchain.service';
import { getRandomInt, shuffleArray } from '../misc/mathHelper';
import { INode } from '../blockchain/models/node';
import { setRandomInterval, setRandomDelay } from '../misc/delayHelper';
import { concatMap, delay, delayWhen, from, merge, mergeMap, of, switchMap, take, takeUntil, takeWhile, tap, timer, toArray } from 'rxjs';
import { LoggerService } from '../command-handler/logger/logger.service';
import { ITransaction } from '../blockchain/models/transaction';
import { IBlock } from '../blockchain/models/block';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  nodes: INode[] = [];
  pendingTransaction: { transaction: ITransaction, recievedBy: number[] } | null = null;
  pendingBlock: { block: IBlock, recievedBy: number[] } | null = null;

  constructor(
    private blockchainService: BlockchainService,
    private loggerService: LoggerService
  ) {
    this.blockchainService.nodes.subscribe(
      x => {
        this.nodes = x;
      }
    );
  }

  simulate() {
    setInterval(() => {
      this.doAction();
    }, 3000);
  }

  doAction() {
    const randomNumber = getRandomInt(1, 7);
  
    switch(randomNumber) {
      case 1: {
        this.tryCreateTransaction() || this.resetAction();
        break;
      }

      case 2: {
        this.tryBroadcastTransaction() || this.resetAction();
        break;
      }

      case 3: {
        this.tryRecieveTransaction() || this.resetAction();
        break;
      }

      case 4: {
        this.tryEnblockTransaction() || this.resetAction();
        break;
      }

      case 5: {
        this.tryCompleteBlock() ||this.resetAction();
        break;
      }

      case 6: {
        this.tryBroadcastBlock() || this.resetAction();
        break;
      }

      case 7: {
        this.tryReceiveBlock() || this.resetAction();
        break;
      }
    }
  }

  resetAction() {
    setTimeout(() => {
      this.doAction();
    }, 0);
  }

  tryCreateTransaction() {
    const { senderIndex, receiverIndex } = this.randomizeTransactionNodes();
    const sender = this.nodes[senderIndex];

    if (sender.newTransaction) {
      return false;
    }

    const transaction = this.blockchainService.createTransaction(
      sender, this.nodes[receiverIndex], this.nodes[receiverIndex].publicKey, 10);

    this.loggerService.logTransactionCreated({
      id: 0,
      type: 'TransactionCreated',
      hash: transaction.hash,
      sender: sender.name,
      reciever: this.nodes[receiverIndex].name,
      amount: transaction.data.amount
    });

    sender.newTransaction = transaction;

    return true;
  }

  tryBroadcastTransaction() {
    const senderIndex = getRandomInt(0, this.nodes.length - 1);
    const sender = this.nodes[senderIndex];

    if (!sender.newTransaction) {
      return false;
    }

    this.blockchainService.broadcastTransaction(sender.newTransaction, sender);

    this.loggerService.logTransactionBroadcasted({
      id: 0,
      type: 'TransactionBroadcasted',
      hash: sender.newTransaction.hash,
      sender: sender.name
    });

    
    this.pendingTransaction = { transaction: sender.newTransaction, recievedBy: [] };
    sender.newTransaction = null;

    return true;
  }

  tryRecieveTransaction() {
    if (!this.pendingTransaction) {
      return false;
    }

    if (this.pendingTransaction.recievedBy.length >= this.nodes.length) {
      this.pendingTransaction.recievedBy = [];
      return false;
    }

    const recieverIndex = getRandomInt(0, this.nodes.length - 1);

    if (this.pendingTransaction.recievedBy.find(x => x === recieverIndex)) {
      return false;
    }

    const reciever = this.nodes[recieverIndex];

    this.blockchainService.receiveTransaction(this.pendingTransaction.transaction, reciever);

    this.loggerService.logTransactionReceived({
      id: 0,
      type: 'TransactionRecieved',
      hash: this.pendingTransaction.transaction.hash,
      reciever: reciever.name
    });

    this.pendingTransaction.recievedBy.push(recieverIndex);

    return true;
  }

  tryEnblockTransaction() {
    const actorIndex = getRandomInt(0, this.nodes.length - 1);
    const actor = this.nodes[actorIndex];

    if (actor.transactionPool.length === 0) {
      return false;
    }

    if ((actor.newBlock?.transactions.length ?? 0) >= 5) {
      return false;
    }

    const transaction = actor.transactionPool.pop();

    if (!transaction) {
      return false;
    }

    this.blockchainService.enblockTransaction(transaction, actor);
    this.loggerService.logTransactionEnblocked({
      id: 0,
      type: 'TransactionEnblocked',
      transactionHash: transaction.hash,
      actor: actor.name,
    });

    return true;
  }

  tryCompleteBlock() {
    const minerIndex = getRandomInt(0, this.nodes.length - 1);
    const miner = this.nodes[minerIndex];

    if (!miner.newBlock) {
      return false;
    }

    if (!this.blockchainService.isBlockReadyToComplete(miner.newBlock)) {
      return false;
    }

    if (this.blockchainService.isBlockCompleted(miner.newBlock)) {
      return false;
    }

    this.blockchainService.completeBlock(miner.newBlock, miner);
    this.loggerService.logBlockGenerated({
      id: 0,
      type: 'BlockGenerated',
      hash: miner.newBlock.hash,
      miner: miner.name,
    });

    return true;
  }

  tryBroadcastBlock() {
    const senderIndex = getRandomInt(0, this.nodes.length - 1);
    const sender = this.nodes[senderIndex];

    if (!sender.newBlock) {
      return false;
    }

    if (!this.blockchainService.isBlockCompleted(sender.newBlock)) {
      return false;
    }

    this.blockchainService.broadcastBlock(sender.newBlock, this.nodes[senderIndex]);

    this.loggerService.logBlockBroadcasted({
      type: 'BlockBroadcasted',
      id: 0,
      hash: sender.newBlock.hash,
      sender: this.nodes[senderIndex].name,
    });

    this.pendingBlock = { block: sender.newBlock, recievedBy: [] };
    sender.newBlock = null;

    return true;
  }

  tryReceiveBlock() {
    if (!this.pendingBlock) {
      return false;
    }

    if (this.pendingBlock.recievedBy.length >= this.nodes.length) {
      this.pendingBlock.recievedBy = [];
      return false;
    }

    const recieverIndex = getRandomInt(0, this.nodes.length - 1);

    if (this.pendingBlock.recievedBy.find(x => x === recieverIndex)) {
      return false;
    }

    const reciever = this.nodes[recieverIndex];

    this.blockchainService.receiveBlock(this.pendingBlock.block, reciever);

    this.loggerService.logBlockRecieved({
      type: 'BlockRecieved',
      id: 0,
      hash: this.pendingBlock.block.hash,
      reciever: reciever.name,
    });

    this.pendingBlock.recievedBy.push(recieverIndex);

    return true;
  }

  private randomizeTransactionNodes(): { senderIndex: number, receiverIndex: number } {
    const nodesCount = this.nodes.length;
    const senderIndex = getRandomInt(0, nodesCount - 1);
    let receiverIndex = 0;

    do {
      receiverIndex = getRandomInt(0, nodesCount - 1);
    }
    while (senderIndex === receiverIndex);

    return {
      senderIndex: senderIndex,
      receiverIndex: receiverIndex
    };
  }
}
