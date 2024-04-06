import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IBlock } from '../../models/block';

@Injectable({
  providedIn: 'root'
})
export class BlockDrawerService {
  blocks: BehaviorSubject<{ nodeName: string, block: IBlock }[]> 
  = new BehaviorSubject<{ nodeName: string, block: IBlock }[]>([]);

  open(block: { nodeName: string, block: IBlock }) {
    const newBlocks = this.blocks.value;
    newBlocks.push(block);
    this.blocks.next(newBlocks);
  }

  close(block: { nodeName: string, block: IBlock }) {
    const newBlocks = this.blocks.value;
    newBlocks.filter(x => x.block.hash !== block.block.hash);
    this.blocks.next(newBlocks);
  }
}
