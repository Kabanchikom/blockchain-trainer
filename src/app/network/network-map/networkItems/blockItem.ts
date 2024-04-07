import { IBlock } from "src/app/blockchain/models/block";

export class BlockItem {
    private x: number;
    private y: number;
    private targets: { x: number; y: number; }[];
    private currentTargetIndex = 0;
    private speed = 5;
    private moving = true;
    private img = './assets/img/box.svg';
    private width = 30;
    private height = 30;
    
    block: IBlock;

    constructor(x: number, y: number, targets: { x: number; y: number; }[], transaction: IBlock) {
        this.x = x;
        this.y = y;
        this.targets = targets;
        this.block = transaction;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        const img = new Image();
        img.src = this.img;
        ctx.drawImage(img, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.fill();
        ctx.closePath();
    }

    public move(speed: number): void {
        if (!this.moving) return; // Если не двигаемся, выходим из метода
        this.speed = speed;

        const currentTarget = this.targets[this.currentTargetIndex];
        const dx = currentTarget.x - this.x;
        const dy = currentTarget.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.speed) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        } else {
            this.x = currentTarget.x;
            this.y = currentTarget.y;
            this.currentTargetIndex++;

            if (this.currentTargetIndex >= this.targets.length) {
                this.moving = false; // Устанавливаем флаг, что больше не двигаемся
            }
        }
    }

    public isMoving(): boolean {
        return this.moving;
    }
}