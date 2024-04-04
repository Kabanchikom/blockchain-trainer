import { Component, OnInit } from '@angular/core';
import { SimulationService } from './simulation/simulation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bitcoin-trainer';

  constructor(
    private simulationService: SimulationService
  ) {}

  ngOnInit(): void {
    this.simulationService.simulate();
  }
}
