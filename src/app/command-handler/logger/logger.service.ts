import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ILogItem } from './models/ILogItem';
import { BlockBroadcasted, BlockGenerated, BlockRecieved, TransactionBroadcasted, TransactionCreated, TransactionEnblocked, TransactionRecieved } from './models/logItems';

const maxLength = 100;

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  items: BehaviorSubject<ILogItem[]> = new BehaviorSubject<ILogItem[]>([]);
  counter: number = 0;

  constructor() { }

  log(item: ILogItem) {
    let newItems = this.items.value;
    if (newItems.length > maxLength) {
      newItems.splice(0, 1);
    }

    item.id = ++this.counter;
    newItems.push(item);
    this.items.next(newItems);
  }

  logTransactionCreated(item: TransactionCreated) {
    this.log(item);
  }

  logTransactionBroadcasted(item: TransactionBroadcasted) {
    this.log(item);
  }

  logTransactionReceived(item: TransactionRecieved) {
    this.log(item);
  }

  logTransactionEnblocked(item: TransactionEnblocked) {
    this.log(item);
  }

  logBlockGenerated(item: BlockGenerated) {
    this.log(item);
  }

  logBlockBroadcasted(item: BlockBroadcasted) {
    this.log(item);
  }

  logBlockRecieved(item: BlockRecieved) {
    this.log(item);
  }
}