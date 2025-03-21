import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOptimizedComponent } from './dashboard-optimized.component';

describe('DashboardOptimizedComponent', () => {
  let component: DashboardOptimizedComponent;
  let fixture: ComponentFixture<DashboardOptimizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOptimizedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardOptimizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
