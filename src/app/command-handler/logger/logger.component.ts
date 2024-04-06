import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoggerService } from './logger.service';
import { ILogItem } from './models/ILogItem';
import { BlockBroadcasted, BlockGenerated, TransactionBroadcasted, TransactionCreated, TransactionEnblocked, TransactionRecieved } from './models/logItems';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit {
  items: ILogItem[] = [];
  isSelecting: boolean = false;

  @ViewChild('logContainer') logContainer!: ElementRef;
  @ViewChild('logContent') logContent!: ElementRef;

  constructor(
    private loggerService: LoggerService
  ) {}

  ngOnInit(): void {
    this.loggerService.items.subscribe(x => {
      if (!this.isSelecting) {
        this.scrollToBottom();
      }
      this.items = x;
    });
  }

  private scrollToBottom(): void {
    try {
      this.logContent.nativeElement.scrollTop = this.logContent.nativeElement.scrollHeight;
    } catch(err) { }
  }

  onMouseDown(): void {
    this.isSelecting = true;
  }

  onMouseUp(): void {
    console.log(window.getSelection());
    if (!window.getSelection()?.toString()) {
      this.isSelecting = false;
    }
  }

  isTransactionCreated(item: ILogItem): item is TransactionCreated {
    return item.type === 'TransactionCreated';
  }

  isTransactionBroadcasted(item: ILogItem): item is TransactionBroadcasted {
    return item.type === 'TransactionBroadcasted';
  }

  isTransactionRecieved(item: ILogItem): item is TransactionRecieved {
    return item.type === 'TransactionRecieved';
  }

  isTransactionEnblocked(item: ILogItem): item is TransactionEnblocked {
    return item.type === 'TransactionEnblocked';
  }

  isBlockGenerated(item: ILogItem): item is BlockGenerated {
    return item.type === 'BlockGenerated';
  }

  isBlockBroadcasted(item: ILogItem): item is BlockBroadcasted {
    return item.type === 'BlockBroadcasted';
  }
}