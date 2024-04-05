import { Component, OnInit } from '@angular/core';
import { LoggerService } from './logger.service';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit {
  messages: string[] = [];

  constructor(
    private loggerService: LoggerService
  ) {}

  ngOnInit(): void {
    this.loggerService.messages.subscribe(x => {
      this.messages = x;
    });
  }
}
