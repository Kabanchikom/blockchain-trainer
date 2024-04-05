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
import { json } from 'd3';

const transactionsInBlock = 5;

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  nodes: BehaviorSubject<INode[]> = new BehaviorSubject<INode[]>([]);

  transactionBuffer: ITransaction[] = [];
  blockBuffer: IBlock[] = [];

  broadcastTransactionSubject: Subject<{transaction: ITransaction, node: INode}> = new Subject();
  receiveTransactionSubject: Subject<ITransaction> = new Subject();

  broadcastBlockSubject: Subject<{block: IBlock, node: INode}> = new Subject();
  receiveBlockSubject: Subject<IBlock> = new Subject();

  constructor(private http: HttpClient) { }

  initNodes(): Observable<INode[]> {
    return this.http.get<INode[]>('assets/data/nodes.json').pipe(
      tap(x => {this.nodes.next(x)})
    );
  }

  createTransaction(node: INode, toAddress: string, amount: number) {
    const data: ITransactionData = {
      fromAddress: node.publicKey,
      toAddress: toAddress,
      amount: amount,
      date: new Date()
    };

    const hash = CryptoJS.SHA256(JSON.stringify(data)).toString();

    const hashBytes = hexStringToUint8Array(hash);
    const privateKeyBytes = hexStringToUint8Array(node.privateKey);
    
    const encodedSignature = secp256k1.ecdsaSign(hashBytes, privateKeyBytes).signature;
    const decodedSignature = uint8ArrayToHexString(encodedSignature);

    // console.log('pubk', node.publicKey);
    // console.log('prk', node.privateKey);
    // console.log('sign', decodedSignature);
    // console.log('hash', hash);

    // const asd = secp256k1.publicKeyVerify(publicKeyToUncompressed(node.publicKey));
    // const asdad = uint8ArrayToHexString(secp256k1.publicKeyCreate(privateKeyBytes))

    // console.log(asdad);
    // console.log(asd);


    const isValid = secp256k1.ecdsaVerify(encodedSignature, hashBytes, publicKeyToUncompressed(node.publicKey));

    // console.log(isValid);

    const transaction: ITransaction = {
        publicKey: node.publicKey,
        hash: hash,
        signature: decodedSignature,
        data: data
    };

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
    
    //console.log(node.name, node.transactionPool);
  }

  enblockTransaction(transaction: ITransaction, node: INode) {
    const newNodes = this.nodes.value;
    const newNode = newNodes.find(x => x.id === node.id);

    if (!newNode) {
      throw new Error(`Узел с id=${newNode} не найден`);
    }

    if (newNode.newBlock === null) {
      newNode.newBlock = {
        id: 0,
        nonce: 0,
        previousHash: '',
        hash: '',
        transactions: [],
        timestamp: null
      }
    }

    if (this.isBlockReadyToComplete(newNode.newBlock)) {
      this.completeBlock(newNode.newBlock, node);   
    } else {
      newNode.transactionPool = newNode.transactionPool.filter(x => x.hash !== transaction.hash);
      newNode.newBlock.transactions.push(transaction);
      // this.nodes.next(newNodes);
      // console.log(newNode.name, newNode.newBlock.transactions);
    }

    return true;
  }

  isBlockReadyToComplete(block: IBlock) {
    return block.transactions.length === transactionsInBlock;
  }

  completeBlock(block: IBlock, node: INode) {
    if (!node.blockchain) {
      throw new Error(`Блокчейн узла с id=${node.id} не инициализирован`);
    }
    const newNodes = this.nodes.value;

    const previousHash = node.blockchain.chain[node.blockchain.chain.length - 1].hash;
    
    const blockHeader = {
      id: node.blockchain.chain.length,
      nonce: getRandomInt(0, Math.pow(2, 32)),
      previousHash: previousHash,
      timestamp: new Date(),
      transactions: block.transactions
    };

    const blockHeaderString: string = blockHeader.previousHash + blockHeader.timestamp + blockHeader.nonce + blockHeader.id;
    const hash = CryptoJS.SHA256(blockHeaderString);
    const doubleHash = CryptoJS.SHA256(hash).toString();

    const newBlock = {
      id: node.blockchain.chain.length,
      nonce: getRandomInt(0, Math.pow(2, 32)),
      timestamp: block.timestamp,
      previousHash: previousHash,
      hash: doubleHash,
      transactions: structuredClone(block.transactions)
    };

    node.newBlock = newBlock;

    this.nodes.next(newNodes);
  }

  isBlockCompleted(block: IBlock) {
    return block.hash !== '';
  }

  broadcastBlock(block: IBlock, node: INode) {
    if (!this.isBlockCompleted(block)) {
      throw new Error(`Блок с id=${node.id} не завершен`);
    }  

    this.blockBuffer.push(block);
    this.broadcastBlockSubject.next({ block: block, node: node });
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

    this.receiveBlockSubject.next(block);
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

  experiment() {
    const privateKey = this.nodes.value[0].privateKey;
    console.log(privateKey);

    const publicKeyBytes = secp256k1.publicKeyCreate(hexStringToUint8Array(privateKey));
    const publicKey = uint8ArrayToHexString(publicKeyBytes);

    console.log(publicKey);

    const publicKeyBytesEncoded = hexStringToUint8Array(publicKey);
    const publicKeyDecoded = uint8ArrayToHexString(publicKeyBytesEncoded);

    console.log(publicKeyDecoded);

    const isPublicKeyValid = secp256k1.publicKeyVerify(publicKeyBytesEncoded);
    console.log(isPublicKeyValid);
  }
}