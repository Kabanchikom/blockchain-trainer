import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INode } from 'src/app/blockchain/models/node';

@Injectable({
  providedIn: 'root'
})
export class NodeDrawerService {
  nodes: BehaviorSubject<INode[]> 
  = new BehaviorSubject<INode[]>([]);

  open(node: INode) {
    const newNodes = this.nodes.value;
    newNodes.push(node);
    this.nodes.next(newNodes);
  }

  close(node: INode) {
    const newNodes = this.nodes.value;
    newNodes.filter(x => x.id !== node.id);
    this.nodes.next(newNodes);
  }
}
