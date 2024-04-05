import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  messages: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() { }

  log(message: string) {
    const newMessages = this.messages.value;
    newMessages.push(message);
    this.messages.next(newMessages);
  }
}
