import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TransactionItem } from './networkItems/transactionItem';
import { INetworkMapItem } from './networkItems/INetworkItem';
import { NodeItem } from './networkItems/nodeItem';
import { InternetItem } from './networkItems/internetItem';
import { BlockchainService } from 'src/app/blockchain/blockchain.service';
import { ITransaction } from 'src/app/blockchain/models/transaction';
import { BlockItem } from './networkItems/blockItem';
import { IBlock } from 'src/app/blockchain/models/block';
import { SimulationService } from 'src/app/simulation/simulation.service';

@Component({
  selector: 'app-network-map',
  templateUrl: './network-map.component.html',
  styleUrls: ['./network-map.component.scss']
})
export class NetworkMapComponent implements OnInit, AfterViewInit {
  @ViewChild('networkTopology', { static: false }) private networkMap!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasWrapper', { static: false }) private canvasWrapper!: ElementRef<HTMLDivElement>;
  context!: CanvasRenderingContext2D;

  internetItem: InternetItem = new InternetItem();

  nodes: NodeItem[] = [];

  canvasWidth: number = 862;

  speed = 0;

  private transactionItems: TransactionItem[] = [];
  private blockItems: BlockItem[] = [];

  constructor(
    private blockchainService: BlockchainService,
    private simulationService: SimulationService
  ) {}

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    this.speed = (1000 / this.simulationService.speed) * 5;

    this.blockchainService.broadcastTransactionSubject.subscribe(
      x => {
        const {transaction, node} = x;
        const nodeItem = this.nodes.find(x => x.node.id == node.id);
        nodeItem && this.initTransactionItemBroadcast(nodeItem, transaction);
      }
    );

    this.blockchainService.receiveTransactionSubject.subscribe(
      x => {
        setTimeout(() => {
          this.transactionItems = this.transactionItems.filter(y => y.transaction.hash !== x.hash);
        }, this.simulationService.speed + this.simulationService.speed / 2);
      }
    );

    this.blockchainService.broadcastBlockSubject.subscribe(
      x => {
        const {block, node} = x;
        const nodeItem = this.nodes.find(x => x.node.id == node.id);
        nodeItem && this.initBlockItemBroadcast(nodeItem, block);
      }
    );

    this.blockchainService.receiveBlockSubject.subscribe(
      x => {
        setTimeout(() => {
          this.blockItems = this.blockItems.filter(y => {
            return y.block.hash !== x.hash}
          );
        }, this.simulationService.speed + this.simulationService.speed / 2);
      }
    );

    this.simulationService.discardBlockSubject.subscribe(
      x => {
        setTimeout(() => {
          this.blockItems = this.blockItems.filter(y => y.block.hash !== x.hash);
        }, this.simulationService.speed + this.simulationService.speed / 2);
      }
    );

    this.blockchainService.initNodes().subscribe(
      x => {
        this.nodes = [
          new NodeItem(-175, -150, x[0]),
          new NodeItem(175, -150, x[1]),
          new NodeItem(200, 100, x[2]),
          new NodeItem(-200, 100, x[3]),
          new NodeItem(0, 200, x[4])
        ]
        this.initAll();
      }
    );
  }

  initAll() {
    this.context = this.networkMap.nativeElement.getContext('2d')!;

    const centerPos = {
      x: this.networkMap.nativeElement.width / 2,
      y: this.networkMap.nativeElement.height / 2
    };

    this.context.translate(centerPos.x - this.internetItem.width, centerPos.y - this.internetItem.height);
    this.context.setLineDash([4, 2]);
    this.context.save();
    this.animate();
  }

  private drawTransactionItem(item: TransactionItem) {
    if(this.transactionItems.length === 0) {
      return;
    }

    item.draw(this.context);

    if (item.isMoving()) {
      item.move(this.speed);
    }
  }

  initTransactionItemBroadcast(sender: NodeItem, transaction: ITransaction) {
    for (const x of this.nodes) {
      if (x === sender) {
        continue;
      }
      this.initTransactionItem(sender, x, transaction);
    }
  }

  initTransactionItem(sender: NodeItem, receiver: NodeItem, transaction: ITransaction) {
    const transactionSource = {
      x: sender.posX + sender.width / 2,
      y: sender.posY + sender.height / 2,
    };

    const transactionTargets = [
      {
        x: this.internetItem.posX + this.internetItem.width / 2,
        y: this.internetItem.posY + this.internetItem.height / 2,
      },
      {
        x: receiver.posX + receiver.width / 2,
        y: receiver.posY + receiver.height / 2,
      }
    ];

    this.transactionItems.push(new TransactionItem(transactionSource.x, transactionSource.y, transactionTargets, transaction));
  }

  private drawBlockItem(item: BlockItem) {
    if(this.blockItems.length === 0) {
      return;
    }

    item.draw(this.context);

    if (item.isMoving()) {
      item.move(this.speed);
    }
  }

  initBlockItemBroadcast(sender: NodeItem, block: IBlock) {
    for (const x of this.nodes) {
      if (x === sender) {
        continue;
      }
      this.initBlockItem(sender, x, block);
    }
  }

  initBlockItem(sender: NodeItem, receiver: NodeItem, block: IBlock) {
    const blockSource = {
      x: sender.posX + sender.width / 2,
      y: sender.posY + sender.height / 2,
    };

    const blockTargets = [
      {
        x: this.internetItem.posX + this.internetItem.width / 2,
        y: this.internetItem.posY + this.internetItem.height / 2,
      },
      {
        x: receiver.posX + receiver.width / 2,
        y: receiver.posY + receiver.height / 2,
      }
    ];

    this.blockItems.push(new BlockItem(blockSource.x, blockSource.y, blockTargets, block));
  }

  private animate(): void {
    this.context.clearRect(-400, -300, this.networkMap!.nativeElement.width, this.networkMap!.nativeElement.height);

    this.drawNetworkMap();

    this.transactionItems.forEach(x => {
      this.drawTransactionItem(x);
    });

    this.blockItems.forEach(x => {
      this.drawBlockItem(x);
    });

    requestAnimationFrame(() => this.animate());
  }

  drawNetworkMap() {
    this.context.save();
    this.nodes.forEach(x => {
      this.drawConnection(x, this.internetItem);
      x.draw(this.context); 
    });
    this.internetItem.draw(this.context);
    this.context.restore();
  }

  drawConnection(item1: INetworkMapItem, item2: INetworkMapItem) {
    this.context.save();
    this.context.strokeStyle = "#6c757d";
    this.context.beginPath();
    this.context.moveTo(item1.posX + item1.width / 2, item1.posY + item1.height / 2);
    this.context.lineTo(item2.posX + item2.width / 2, item2.posY + item2.height / 2);
    this.context.stroke();
    this.context.closePath();
    this.context.restore();
  }
}