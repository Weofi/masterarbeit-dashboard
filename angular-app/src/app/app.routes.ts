import { Routes } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '1k', component: DashboardComponent, data: { dataSet: 1000 } },
  { path: '10k', component: DashboardComponent, data: { dataSet: 10_000 } },
  { path: '100k', component: DashboardComponent, data: { dataSet: 100_000 }  },
  { path: '1M', component: DashboardComponent, data: { dataSet: 1_000_000 }  },
  { path: '**', redirectTo: "1k" },
];
