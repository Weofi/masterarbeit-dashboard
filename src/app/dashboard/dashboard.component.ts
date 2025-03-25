import {Component, inject, Input, OnInit} from '@angular/core';
import {DataService, Person} from '../data-service/data.service';
import {CardComponent} from '../card/card.component';
import {combineLatest, debounceTime, map, Observable, startWith} from 'rxjs';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    CardComponent,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
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
      map(([personData, search]) => {
        if (search.length <= 0) return personData;
        return personData.filter(person =>
          (person.first_name + person.last_name + person.email + person.gender + person.id).toLowerCase().includes(search.toLowerCase().replaceAll(" ","")))
      }),
    );
  }
}
