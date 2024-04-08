import { Component, OnInit } from '@angular/core';
import { NodeDrawerService } from './node-drawer.service';
import { INode } from 'src/app/blockchain/models/node';

@Component({
  selector: 'app-node-drawer',
  templateUrl: './node-drawer.component.html',
  styleUrls: ['./node-drawer.component.scss']
})
export class NodeDrawerComponent implements OnInit {
  nodes: INode[] = [];

  constructor(
    private nodeDrawerService: NodeDrawerService
  ) {}

  ngOnInit(): void {
    this.nodeDrawerService.nodes.subscribe(
      x => {
        this.nodes = x;
      }
    );
  }
}