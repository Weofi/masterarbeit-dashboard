import {Component, inject, Input, OnInit} from '@angular/core';
import {DataService, Person} from '../data-service/data.service';
import {combineLatest, debounceTime, map, Observable, startWith} from 'rxjs';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CardComponent} from '../card/card.component';
import {AsyncPipe} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-dashboard-optimized',
  imports: [
    ScrollingModule,
    CardComponent,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard-optimized.component.html',
  styleUrl: './dashboard-optimized.component.css'
})
export class DashboardOptimizedComponent implements OnInit {
  @Input() public dataSet: 1000 | 10_000 | 50_000 = 1000;
  private readonly dataService = inject(DataService);

  public filteredPersonData$!: Observable<Person[]>;
  public searchForm = new FormControl;


  private getPersonData() {
    switch (this.dataSet) {
      case 1000:
        return this.dataService.get1k();
      case 10_000:
        return this.dataService.get10k();
      case 50_000:
        return this.dataService.get50k();
    }
  }

  ngOnInit(): void {
    this.filteredPersonData$ =  combineLatest([
      this.getPersonData(),
      this.searchForm.valueChanges.pipe(
        startWith(''),
        debounceTime(300)
      ),
    ]).pipe(
      map(([personData, search]) => search.length > 0 ? personData :
        personData.filter(person =>
          (person.first_name + person.last_name + person.email + person.gender).toLowerCase().includes(search.toLowerCase().replaceAll(" ","")))
      ),
    );
  }
}
