import { INetworkMapItem } from "./INetworkItem";

export class InternetItem implements INetworkMapItem {
    posX: number = 0;
    posY: number = 0;
    width: number = 50;
    height: number = 50;
    img: string = './assets/img/cloudy-fill.svg';
    capture: string = 'Интернет';

    draw(ctx: CanvasRenderingContext2D) {
        const img = new Image();
        img.src = this.img;
        img.onload = () => ctx.drawImage(img, this.posX, this.posY, this.width, this.height);
        ctx.drawImage(img, this.posX, this.posY, this.width, this.height);
        ctx.textAlign = 'center';
        ctx.fillText(this.capture, this.posX + this.width / 2, this.posY + this.height);
    }
}