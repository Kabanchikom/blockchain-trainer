import { Component, OnInit } from '@angular/core';
import { INode } from '../../models/node';
import { BlockchainService } from '../../blockchain.service';
import { IBlock } from '../../models/block';
import { BlockDrawerService } from '../../block/block-drawer/block-drawer.service';

@Component({
  selector: 'app-blockchain-miniature',
  templateUrl: './blockchain-miniature.component.html',
  styleUrls: ['./blockchain-miniature.component.scss']
})
export class BlockchainMiniatureComponent implements OnInit {
  nodes: INode[] = [];

  constructor(
    private blockchainService: BlockchainService,
    private blockDrawerService: BlockDrawerService
  ) { }

  ngOnInit(): void {
    this.blockchainService.nodes.subscribe(
      x => {
        this.nodes = x;
      }
    );
  }

  onClick(nodeName: string, block: IBlock ) {
    this.blockDrawerService.open({
      nodeName: nodeName,
      block: block
    });
  }
}
