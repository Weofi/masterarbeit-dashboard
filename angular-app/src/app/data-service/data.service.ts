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
    return this.httpClient.get<Person[]>('./MOCK_DATA_10_000.json');
  }

  public get100k() {
    return this.httpClient.get<Person[]>('./MOCK_DATA_100_000.json');
  }

  public get1M() {
    return this.httpClient.get<Person[]>('./MOCK_DATA_1_000_000.json');
  }
}
