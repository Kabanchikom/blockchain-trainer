import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoggerService } from './logger.service';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit {
  messages: string[] = [];
  isSelecting: boolean = false;

  @ViewChild('logContainer') logContainer!: ElementRef;
  @ViewChild('logContent') logContent!: ElementRef;

  constructor(
    private loggerService: LoggerService
  ) {}

  ngOnInit(): void {
    this.loggerService.messages.subscribe(x => {
      if (!this.isSelecting) {
        this.scrollToBottom();
      }
      this.messages = x;
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

  trackByFn(index: number, item: string): number {
    return index; // Возвращаем уникальный идентификатор элемента списка
  }
}
