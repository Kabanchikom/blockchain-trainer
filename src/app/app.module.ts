import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlockchainModule } from './blockchain/blockchain.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NetworkModule } from './network/network.module';
import { NodeListComponent } from './nodes/node-list/node-list.component';
import { SimulationControlsComponent } from './simulation/simulation-controls/simulation-controls.component';
import { LoggerComponent } from './command-handler/logger/logger.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NodeListComponent,
    SimulationControlsComponent,
    LoggerComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BlockchainModule,
    NetworkModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
