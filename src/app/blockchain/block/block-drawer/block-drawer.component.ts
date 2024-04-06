import { Component, OnInit } from '@angular/core';
import { BlockDrawerService } from './block-drawer.service';
import { IBlock } from '../../models/block';

@Component({
  selector: 'app-block-drawer',
  templateUrl: './block-drawer.component.html',
  styleUrls: ['./block-drawer.component.scss']
})
export class BlockDrawerComponent implements OnInit {
  blocks: { nodeName: string, block: IBlock }[] = [];

  constructor(
    private blockDrawerService: BlockDrawerService
  ) {}

  ngOnInit(): void {
    this.blockDrawerService.blocks.subscribe(
      x => {
        this.blocks = x;
      }
    );
  }
}
