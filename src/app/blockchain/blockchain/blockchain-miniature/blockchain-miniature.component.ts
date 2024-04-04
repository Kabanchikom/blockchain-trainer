import { Component, OnInit } from '@angular/core';
import { INode } from '../../models/node';
import { BlockchainService } from '../../blockchain.service';

@Component({
  selector: 'app-blockchain-miniature',
  templateUrl: './blockchain-miniature.component.html',
  styleUrls: ['./blockchain-miniature.component.scss']
})
export class BlockchainMiniatureComponent implements OnInit {
  nodes: INode[] = [];

  constructor(
    private blockchainService: BlockchainService
  ) { }

  ngOnInit(): void {
    this.blockchainService.nodes.subscribe(
      x => {
        this.nodes = x;
      }
    );
  }
}
