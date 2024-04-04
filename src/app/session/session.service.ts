import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INode } from '../blockchain/models/node';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) { }

  loadSession(): Observable<INode[]> {
    return this.http.get<INode[]>('assets/data/nodes.json');
  }
}
