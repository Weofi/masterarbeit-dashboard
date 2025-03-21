import {Component, inject} from '@angular/core';
import {DataService} from '../data-service/data.service';
import {AsyncPipe} from '@angular/common';
import {CardComponent} from '../card/card.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    CardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private readonly dataService = inject(DataService);

  public personData$ = this.dataService.getAll();
}
