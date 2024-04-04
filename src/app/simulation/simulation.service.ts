import { Injectable, OnInit } from '@angular/core';
import { BlockchainService } from '../blockchain/blockchain.service';
import { InternetItem } from '../network/network-map/networkItems/internetItem';
import { NodeItem } from '../network/network-map/networkItems/nodeItem';
import { getRandomInt } from '../misc/mathHelper';
import { INode } from '../blockchain/models/node';
import { setRandomTimeout } from '../misc/delayHelper';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  nodes: INode[] = [];

  speed: BehaviorSubject<number> = new BehaviorSubject(1);
  lastSpeed: number = this.speed.value;

  constructor(
    private blockchainService: BlockchainService
  ) {
    this.blockchainService.nodes.subscribe(
      x => {
        this.nodes = x;
      }
    );
  }

  simulate() {
    setRandomTimeout(() => {
      this.doTransaction();
    }, 1000 * this.speed.value, 3000 * this.speed.value);

    setRandomTimeout(() => {
      this.propagateBlock();
    }, 3333 * this.speed.value, 6666 * this.speed.value);
  }

  play() {
    this.speed.next(this.lastSpeed);
  }

  pause() {
    this.lastSpeed = this.speed.value;
    this.speed.next(0);
  }

  slowDown(delta: number) {
    this.speed.next(this.speed.value - delta);
  }

  speedUp(delta: number) {
    this.speed.next(this.speed.value + delta);
  }

  doTransaction() {
    const { senderIndex, receiverIndex } = this.randomizeTransactionNodes();

    const transaction = this.blockchainService.createTransaction(
      this.nodes[senderIndex], this.nodes[receiverIndex].publicKey, 10);

    this.blockchainService.broadcastTransaction(transaction, this.nodes[senderIndex]);

    this.nodes.forEach(x => {
      // todo убрать из получателей узел-отправитель
      this.blockchainService.receiveTransaction(transaction, x)
    });

    this.nodes.forEach(x => {
      // todo убрать из получателей узел-отправитель
      this.blockchainService.enblockTransaction(transaction, x);
    });

    // if ((this.nodes[0].blockchain?.chain.length ?? 0) > 1) {
    //   console.log(this.nodes);
    //   debugger;
    // }  
  }

  propagateBlock() {
    const senderIndex = getRandomInt(0, this.nodes.length - 1);

    const block = this.nodes[senderIndex].newBlock;

    if (block == null || !this.blockchainService.isBlockCompleted(block)) {
      return;
    }

    this.blockchainService.broadcastBlock(block, this.nodes[senderIndex]);

    this.nodes.forEach(x => {
      // todo убрать из получателей узел-отправитель
      this.blockchainService.receiveBlock(block, x)
    });

    // if (this.nodes.find(x => (x.blockchain?.chain.length ?? 0) > 10)) {
    //   console.clear();
    //   console.log(this.nodes);
    //   debugger;
    // }  
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
