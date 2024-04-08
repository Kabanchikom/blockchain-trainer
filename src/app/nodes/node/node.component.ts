import { Component, Input, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/blockchain/blockchain.service';
import { IBlock } from 'src/app/blockchain/models/block';
import { INode } from 'src/app/blockchain/models/node';
import { ITransaction } from 'src/app/blockchain/models/transaction';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
  showNode: boolean = true;
  isTransactionsPoolCollapsed = true;

  @Input() node: INode | null = null;

  newTransaction: ITransaction | null = null;
  newBlock: IBlock | null = null;
  transactionPool: ITransaction[] = [];

  constructor(
    private blockchainService: BlockchainService
  ) {}

  ngOnInit(): void {
    this.blockchainService.nodes.subscribe(
      x => {
        const node = x.find(x => x.id === this.node?.id);

        if (!node) {
          return;
        }

        this.newTransaction = node.newTransaction;
        this.newBlock = node.newBlock;
        this.transactionPool = node.transactionPool;
      }
    )
  }

  closeNode() {
    this.showNode = false;
  }

  onTransactionsPoolClick() {
    this.isTransactionsPoolCollapsed = !this.isTransactionsPoolCollapsed;
  }
}
