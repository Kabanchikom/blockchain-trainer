import { INetworkMapItem } from "./INetworkItem";
import { INode } from '../../../blockchain/models/node'

export class NodeItem implements INetworkMapItem {
    posX: number;
    posY: number;
    width: number = 40;
    height: number = 40;
    img: string = './assets/img/pc-display.svg'
    node: INode;

    balance: number;

    constructor(posX: number, posY: number, node: INode, balance: number) {
        this.posX = posX;
        this.posY = posY;
        this.node = node;
        this.balance = balance;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const img = new Image();
        img.src = this.img;
        img.onload = () => ctx.drawImage(img, this.posX, this.posY, this.width, this.height);
        ctx.drawImage(img, this.posX, this.posY, this.width, this.height);
        ctx.textAlign = 'center';
        ctx.fillText(this.node.name, this.posX + this.width / 2, this.posY + this.height + 10);
        ctx.fillText(this.node.name, this.posX + this.width / 2, this.posY + this.height + 10);
        ctx.save();
        ctx.fillStyle = '#28a745';
        ctx.fillText(this.balance.toString() + ' BTC', this.posX + this.width / 2, this.posY + this.height + 20);
        ctx.restore();
    }

    setBalance(amount: number) {
        this.balance = amount;
    }
}