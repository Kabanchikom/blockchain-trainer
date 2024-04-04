import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SimulationService } from '../simulation.service';

@Component({
  selector: 'app-simulation-controls',
  templateUrl: './simulation-controls.component.html',
  styleUrls: ['./simulation-controls.component.scss']
})
export class SimulationControlsComponent implements AfterViewInit {
  speed: number = 1;

  constructor (
    private simulationService: SimulationService
  ) {}

  ngAfterViewInit(): void {
    this.simulationService.speed.subscribe(
      x => {
        this.speed = x;
        console.log(this.speed);
      }
    );
  }

  ngOnInit(): void {
    
  }

  play() {
    this.simulationService.play(); 
  }

  pause() {
    this.simulationService.pause(); 
  }

  slowDown(delta: number) {
    this.simulationService.slowDown(delta); 
  }

  speedUp(delta: number) {
    this.simulationService.speedUp(delta);
  }
}