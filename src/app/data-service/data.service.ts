import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface Person {
  id: number,
  first_name: string,
  last_name: string,
  email: string,
  gender: "Male" | "Female" | "Genderqueer",
  avatar: string,
  balance: string,
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private httpClient = inject(HttpClient);

  public get1k() {
    return this.httpClient.get<Person[]>('./MOCK_DATA.json');
  }

  public get10k() {
    return this.httpClient.get<Person[]>('./MOCK_DATA_10000.json');
  }

  public get50k() {
    return this.httpClient.get<Person[]>('./MOCK_DATA_50000.json');
  }
}
