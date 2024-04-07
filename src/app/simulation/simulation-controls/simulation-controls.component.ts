import { Component, OnInit } from '@angular/core';
import { SimulationService } from '../simulation.service';

@Component({
  selector: 'app-simulation-controls',
  templateUrl: './simulation-controls.component.html',
  styleUrls: ['./simulation-controls.component.scss']
})
export class SimulationControlsComponent implements OnInit {
  readonly oneSecond = 1000;

  readonly minSpeed = 0;
  readonly maxSpeed = 10000;
  speed = 0;
  timeRate = 0;

  constructor(
    private simulationService: SimulationService
  ) {
    this.simulationService.setTimerate(1000);
  }

  ngOnInit(): void {
    
    this.simulationService.timeRate.subscribe(
      x => {
        this.timeRate = x;
        this.speed = this.speed = ((this.maxSpeed / 2) * this.oneSecond) / this.timeRate;
      }
    )
  }

  onSpeedChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value);

    this.simulationService.setTimerate(((this.maxSpeed / 2) * this.oneSecond) / this.speed);
  }
}
