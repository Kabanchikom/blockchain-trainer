import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from  '@angular/common/http';
import { BlockchainComponent } from './blockchain/blockchain.component';
import { FormsModule } from '@angular/forms';
import { BlockchainMiniatureComponent } from './blockchain/blockchain-miniature/blockchain-miniature.component';



@NgModule({
  declarations: [
    BlockchainComponent,
    BlockchainMiniatureComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    BlockchainComponent,
    BlockchainMiniatureComponent
  ]
})
export class BlockchainModule { }
