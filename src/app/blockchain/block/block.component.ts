import { Component, Input } from '@angular/core';
import { IBlock } from '../models/block';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent {
  showBlock = true;
  isTransactionsCollapsed = true;

  @Input() block: { nodeName: string, block: IBlock } | null = null;

  closeBlock() {
    this.showBlock = false;
  }

  onTransactionsClick() {
    this.isTransactionsCollapsed = !this.isTransactionsCollapsed;
  }
}
