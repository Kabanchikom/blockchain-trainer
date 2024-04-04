import { Component } from '@angular/core';
import { BlockchainService } from '../blockchain.service';
import { Blockchain } from 'src/app/blockchain/models/blockchain';

@Component({
  selector: 'app-blockchain',
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.scss']
})
export class BlockchainComponent {
  public blockchain: Blockchain | null = null;
  public newBlockData: any;

  constructor(private blockchainService: BlockchainService) {
    //this.blockchain = this.blockchainService.getBlockchain();
  }

  mineBlock(): void {
    //this.blockchainService.mineBlock(this.newBlockData);
    this.newBlockData = '';
  }

  isChainValid() {
    //return this.blockchainService.isChainValid();
  }
}