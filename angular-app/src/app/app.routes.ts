import { Routes } from '@angular/router';
import {DashboardOptimizedComponent} from './dashboard-optimized/dashboard-optimized.component';

export const routes: Routes = [
  { path: '1k', component: DashboardOptimizedComponent, data: { dataSet: 1000 } },
  { path: '10k', component: DashboardOptimizedComponent, data: { dataSet: 10_000 } },
  { path: '100k', component: DashboardOptimizedComponent, data: { dataSet: 100_000 }  },
  { path: '1M', component: DashboardOptimizedComponent, data: { dataSet: 1_000_000 }  },
  { path: '**', redirectTo: "1k" },
];
