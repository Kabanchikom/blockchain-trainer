import { Component, OnInit } from '@angular/core';
import { INode } from '../../blockchain/models/node';
import { BlockchainService } from 'src/app/blockchain/blockchain.service';
import { NodeDrawerService } from '../node/node-drawer/node-drawer.service';

@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss']
})
export class NodeListComponent implements OnInit {
  nodes: INode[] = [];

  constructor(
    private blockchainService: BlockchainService,
    private nodeDrawerService: NodeDrawerService
  ) { }

  ngOnInit(): void {
    this.blockchainService.initNodes().subscribe(
      x => this.nodes = x
    );
  }

  onNodeClick(node: INode) {
    this.nodeDrawerService.open(node);
  }
}
