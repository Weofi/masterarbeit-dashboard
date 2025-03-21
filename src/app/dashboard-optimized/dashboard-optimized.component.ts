import {Component, inject, Input, OnInit} from '@angular/core';
import {DataService, Person} from '../data-service/data.service';
import {Observable} from 'rxjs';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CardComponent} from '../card/card.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-dashboard-optimized',
  imports: [
    ScrollingModule,
    CardComponent,
    AsyncPipe
  ],
  templateUrl: './dashboard-optimized.component.html',
  styleUrl: './dashboard-optimized.component.css'
})
export class DashboardOptimizedComponent implements OnInit {
  @Input() public dataSet: 1000 | 10_000 | 100_000 = 1000;
  private readonly dataService = inject(DataService);

  public personData$!: Observable<Person[]>;

  private getPersonData() {
    switch (this.dataSet) {
      case 1000:
        return this.dataService.get1k();
      case 10_000:
        return  this.dataService.get10k();
      case 100_000:
        return  this.dataService.get100k();
    }
  }

  ngOnInit(): void {
    this.personData$ = this.getPersonData();
  }
}
