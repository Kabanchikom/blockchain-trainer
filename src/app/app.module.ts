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
import { FormsModule } from '@angular/forms';
import { NodeComponent } from './nodes/node/node.component';
import { NodeDrawerComponent } from './nodes/node/node-drawer/node-drawer.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NodeBlockComponent } from './nodes/node-block/node-block.component';

@NgModule({
  declarations: [
    AppComponent,
    NodeListComponent,
    SimulationControlsComponent,
    LoggerComponent,
    NodeComponent,
    NodeDrawerComponent,
    NodeBlockComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BlockchainModule,
    FormsModule,
    NetworkModule,
    NgbModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
