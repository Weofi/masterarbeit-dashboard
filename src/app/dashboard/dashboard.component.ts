import {Component, inject, Input, OnInit} from '@angular/core';
import {DataService, Person} from '../data-service/data.service';
import {AsyncPipe} from '@angular/common';
import {CardComponent} from '../card/card.component';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    CardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  @Input() public dataSet: 1000 | 10_000 | 50_000 = 1000;
  private readonly dataService = inject(DataService);

  public personData$!: Observable<Person[]>;

  private getPersonData() {
    switch (this.dataSet) {
      case 1000:
        return this.dataService.get1k();
      case 10_000:
        return  this.dataService.get10k();
      case 50_000:
        return  this.dataService.get50k();
    }
  }

  ngOnInit(): void {
    this.personData$ = this.getPersonData();
  }
}
