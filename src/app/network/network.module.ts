import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkMapComponent } from './network-map/network-map.component';



@NgModule({
  declarations: [
    NetworkMapComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NetworkMapComponent
  ]
})
export class NetworkModule { }
