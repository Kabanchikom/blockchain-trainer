import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from  '@angular/common/http';
import { BlockchainComponent } from './blockchain/blockchain.component';
import { FormsModule } from '@angular/forms';
import { BlockchainMiniatureComponent } from './blockchain/blockchain-miniature/blockchain-miniature.component';
import { BlockComponent } from './block/block.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BlockDrawerComponent } from './block/block-drawer/block-drawer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    BlockchainComponent,
    BlockchainMiniatureComponent,
    BlockComponent,
    BlockDrawerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    NgbModule
  ],
  exports: [
    BlockchainComponent,
    BlockchainMiniatureComponent,
    BlockComponent,
    BlockDrawerComponent
  ]
})
export class BlockchainModule { }
