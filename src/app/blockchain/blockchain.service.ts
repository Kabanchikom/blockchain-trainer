import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ITransactionData } from './models/transactionData';
import { ITransaction } from './models/transaction';
import { INode } from './models/node';
import * as CryptoJS from 'crypto-js';
import * as secp256k1 from 'secp256k1';
import { hexStringToUint8Array, publicKeyToUncompressed, uint8ArrayToHexString } from '../misc/encodingHelpers';
import { IBlock } from './models/block';
import { getRandomInt } from '../misc/mathHelper';
import { LoggerService } from '../command-handler/logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  readonly transactionsInBlock = 3;
  readonly minerReward = 10;

  nodes: BehaviorSubject<INode[]> = new BehaviorSubject<INode[]>([]);

  transactionBuffer: ITransaction[] = [];
  blockBuffer: IBlock[] = [];

  broadcastTransactionSubject: Subject<{ transaction: ITransaction, node: INode }> = new Subject();
  receiveTransactionSubject: Subject<ITransaction> = new Subject();

  broadcastBlockSubject: Subject<{ block: IBlock, node: INode }> = new Subject();
  receiveBlockSubject: Subject<{ block: IBlock, node: INode }> = new Subject();

  constructor(
    private http: HttpClient
  ) { }

  initNodes(): Observable<INode[]> {
    return this.http.get<INode[]>('assets/data/nodes.json').pipe(
      tap(x => { this.nodes.next(x) })
    );
  }

  createTransaction(sender: INode, receiver: INode, toAddress: string, amount: number) {
    const newNodes: INode[] = this.nodes.value;
    const newNode = newNodes.find(x => x.id === sender.id);

    if (!newNode) {
      throw new Error(`Узел с id=${newNode} не найден`);
    }

    const data: ITransactionData = {
      fromAddress: sender.publicKey,
      toAddress: toAddress,
      amount: amount,
      date: new Date()
    };

    const hash = CryptoJS.SHA256(JSON.stringify(data)).toString();

    const hashBytes = hexStringToUint8Array(hash);
    const privateKeyBytes = hexStringToUint8Array(sender.privateKey);

    const encodedSignature = secp256k1.ecdsaSign(hashBytes, privateKeyBytes).signature;
    const decodedSignature = uint8ArrayToHexString(encodedSignature);

    const isValid = secp256k1.ecdsaVerify(encodedSignature, hashBytes, publicKeyToUncompressed(sender.publicKey));

    const transaction: ITransaction = {
      publicKey: sender.publicKey,
      hash: hash,
      signature: decodedSignature,
      data: data
    };

    newNode.newTransaction = transaction;
    this.nodes.next(newNodes);

    return transaction;
  }

  broadcastTransaction(transaction: ITransaction, node: INode) {
    this.transactionBuffer.push(transaction);
    this.broadcastTransactionSubject.next({ transaction: transaction, node: node });

  }

  receiveTransaction(transaction: ITransaction, node: INode) {
    const newNodes: INode[] = this.nodes.value;
    let newNode = newNodes.find(x => x.id === node.id);

    if (!newNode) {
      throw new Error(`Узел с id=${newNode} не найден`);
    }

    newNode.transactionPool.push(transaction);
    this.nodes.next(newNodes);

    const newBuffer = this.transactionBuffer.filter(x => x.hash !== transaction.hash);
    this.transactionBuffer = newBuffer;

    this.receiveTransactionSubject.next(transaction);
  }

  enblockTransaction(transaction: ITransaction, node: INode) {
    const newNodes = this.nodes.value;
    const newNode = newNodes.find(x => x.id === node.id);

    if (!newNode) {
      throw new Error(`Узел с id=${newNode} не найден`);
    }

    if (!newNode.blockchain) {
      throw new Error(`Блокчейн узла с id=${node.id} не инициализирован`);
    }

    if (newNode.newBlock === null) {
      newNode.newBlock = {
        nonce: 0,
        previousHash: '',
        hash: '',
        transactions: [],
        timestamp: null,
        coinbase: null
      }
    }

    //newNode.transactionPool = newNode.transactionPool.filter(x => x.hash !== transaction.hash);
    newNode.newBlock.transactions.push(transaction);
    this.nodes.next(newNodes);
  }

  isBlockReadyToComplete(block: IBlock) {
    return block.transactions.length === this.transactionsInBlock;
  }

  completeBlock(block: IBlock, node: INode) {
    if (!node.blockchain) {
      throw new Error(`Блокчейн узла с id=${node.id} не инициализирован`);
    }
    const newNodes = this.nodes.value;
    const newNode = newNodes.find(x => x.id === node.id);

    if (!newNode) {
      throw new Error(`Узел с id=${newNode} не найден`);
    }

    if (!newNode.blockchain) {
      throw new Error(`Блокчейн узла с id=${node.id} не инициализирован`);
    }

    const previousHash = newNode.blockchain.chain[newNode.blockchain.chain.length - 1].hash;

    const timestamp = new Date()
    const blockHeader = {
      id: block.hash,
      nonce: getRandomInt(0, Math.pow(2, 32)),
      previousHash: previousHash,
      timestamp: timestamp,
      transactions: block.transactions
    };

    const blockHeaderString: string = blockHeader.previousHash + blockHeader.timestamp + blockHeader.nonce + blockHeader.id;
    const hash = CryptoJS.SHA256(blockHeaderString);
    const doubleHash = CryptoJS.SHA256(hash).toString();

    const newBlock = {
      id: block.hash,
      nonce: getRandomInt(0, Math.pow(2, 32)),
      timestamp: timestamp,
      previousHash: previousHash,
      hash: doubleHash,
      transactions: structuredClone(block.transactions),
      coinbase: {
        miner: newNode.publicKey,
        amount: this.minerReward
      }
    };

    newNode.newBlock = newBlock;

    this.nodes.next(newNodes);
  }

  isBlockCompleted(block: IBlock) {
    return block.hash !== '';
  }

  broadcastBlock(block: IBlock, node: INode) {
    if (!this.isBlockCompleted(block)) {
      throw new Error(`Блок ${block.hash} не завершен`);
    }  

    this.blockBuffer.push(block);
    this.broadcastBlockSubject.next({ block: block, node: node });
  }

  hasBlock(block: IBlock, node: INode) {
    if (node.blockchain?.chain.find(x => x.hash === block.hash)) {
      return true
    }

    return false;
  }

  isSubsequenceCorrect(block: IBlock, node: INode) {
    if (!node.blockchain) {
      throw new Error(`Блокчейн узла с id=${node.id} не инициализирован`);
    }

    const chain = node.blockchain.chain;

    if (node.blockchain.chain[chain.length - 1].hash !== block.previousHash) {
      return false
    }

    return true;
  }

  receiveBlock(block: IBlock, node: INode) {
    const newNodes: INode[] = this.nodes.value;
    let newNode = newNodes.find(x => x.id === node.id);

    if (!newNode) {
      throw new Error(`Узел с id=${newNode} не найден`);
    }

    newNode.blockchain?.chain.push(block);
    this.nodes.next(newNodes);

    const newBuffer = this.blockBuffer.filter(x => x.hash !== block.hash);
    this.blockBuffer = newBuffer;

    this.receiveBlockSubject.next({block: block, node: node});
  }

  clearBuffer(node: INode) {
    const newNodes: INode[] = this.nodes.value;
    let newNode = newNodes.find(x => x.id === node.id);

    if (!newNode) {
      throw new Error(`Узел с id=${newNode} не найден`);
    }

    newNode.newBlock = null;
    this.nodes.next(newNodes);
  }

  getBalance(publicKey: string): number | null {
    const node = this.nodes.value.find(x => x.publicKey === publicKey);

    if (!node) {
      return null;
    }

    if (!node.blockchain) {
      return null;
    }

    const transactions = node.blockchain.chain
    .flatMap((x: IBlock) => x.transactions.flatMap(y => y.data));

    if (!transactions) {
      return null;
    }


    const fromTransactions = transactions?.filter(x => x.fromAddress === publicKey);
    const toTransactions = transactions?.filter(x => x.toAddress === publicKey);

    const spendedCurrency = fromTransactions?.reduce((accumulator, x) => accumulator + x.amount, 0);
    const recievedCurrency = toTransactions?.reduce((accumulator, x) => accumulator + x.amount, 0);

    const coinbase = node.blockchain.chain.flatMap(x => x.coinbase).filter(x => x?.miner === node.publicKey);

    const minerReward = coinbase.reduce((accumulator, x) => accumulator + (x?.amount ?? 0), 0);

    return (recievedCurrency ?? 0) + minerReward - (spendedCurrency ?? 0);
  }
}