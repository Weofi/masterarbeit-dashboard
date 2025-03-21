import { Routes } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DashboardOptimizedComponent} from './dashboard-optimized/dashboard-optimized.component';

export const routes: Routes = [
  { path: '1k', component: DashboardComponent, data: { dataSet: 1000 } },
  { path: '10k', component: DashboardComponent, data: { dataSet: 10_000 } },
  { path: '100k', component: DashboardComponent, data: { dataSet: 100_000 }  },
  { path: 'optimized/1k', component: DashboardOptimizedComponent, data: { dataSet: 1000 } },
  { path: 'optimized/10k', component: DashboardOptimizedComponent, data: { dataSet: 10_000 } },
  { path: 'optimized/100k', component: DashboardOptimizedComponent, data: { dataSet: 100_000 }  },
  { path: '**', redirectTo: "1k" },
];
