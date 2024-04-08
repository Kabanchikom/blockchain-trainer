import { Component, Input } from '@angular/core';
import { IBlock } from 'src/app/blockchain/models/block';

@Component({
  selector: 'app-node-block',
  templateUrl: './node-block.component.html',
  styleUrls: ['./node-block.component.scss']
})
export class NodeBlockComponent {
  isTransactionsCollapsed = true;

  @Input() block: IBlock | null = null;

  onTransactionsClick() {
    this.isTransactionsCollapsed = !this.isTransactionsCollapsed;
  }
}