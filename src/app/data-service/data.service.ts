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

  public getAll() {
    return this.httpClient.get<Person[]>('./MOCK_DATA.json');
  }
}
