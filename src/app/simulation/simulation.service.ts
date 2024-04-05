import { Injectable } from '@angular/core';
import { BlockchainService } from '../blockchain/blockchain.service';
import { getRandomInt, shuffleArray } from '../misc/mathHelper';
import { INode } from '../blockchain/models/node';
import { setRandomInterval, setRandomDelay } from '../misc/delayHelper';
import { concatMap, from, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  nodes: INode[] = [];

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
    setRandomInterval(1000, 2000, () => {
      this.doTransaction(1000, 2000).subscribe();
    });

    setRandomInterval(3333, 6666, () => {
      this.propagateBlock(2222, 3333)?.subscribe();
    });
  }

  private doTransaction(minInterval: number, maxInterval: number) {
    const { senderIndex, receiverIndex } = this.randomizeTransactionNodes();
    const transaction = this.blockchainService.createTransaction(
      this.nodes[senderIndex], this.nodes[receiverIndex], this.nodes[receiverIndex].publicKey, 10);

    return setRandomDelay(minInterval, maxInterval).pipe(
      tap(() => {
        this.blockchainService.broadcastTransaction(transaction, this.nodes[senderIndex]);
      }),
      concatMap(() => from(this.nodes).pipe(
        concatMap(x => {
          return setRandomDelay(minInterval, maxInterval).pipe(
            tap(() => {
              this.blockchainService.receiveTransaction(transaction, x);
            })
          );
        })
      )),
      concatMap(() => from(this.nodes).pipe(
        concatMap(x => {
          return setRandomDelay(minInterval, maxInterval).pipe(
            tap(() => {
              this.blockchainService.enblockTransaction(transaction, x);
            })
          );
        })
      ))
    )
  }

  private propagateBlock(minInterval: number, maxInterval: number) {
    const senderIndex = getRandomInt(0, this.nodes.length - 1);

    const block = this.nodes[senderIndex].newBlock;

    if (block == null || !this.blockchainService.isBlockCompleted(block)) {
      return;
    }

    return setRandomDelay(minInterval, maxInterval).pipe(
      tap(() => {
        this.blockchainService.broadcastBlock(block, this.nodes[senderIndex]);
      }),
      concatMap(() => from(shuffleArray(this.nodes)).pipe(
        concatMap(x => {
          return setRandomDelay(minInterval, maxInterval).pipe(
            tap(() => {
              this.blockchainService.receiveBlock(block, x);
              this.blockchainService.clearBuffer(x);

              if (this.nodes.find(x => (x.blockchain?.chain.length ?? 0) > 3)) {
                console.clear();
                console.log(this.nodes);
                debugger;
              }
            })
          );
        })
      ))
    )
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
