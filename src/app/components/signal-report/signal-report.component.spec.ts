import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalReportComponent } from './signal-report.component';

describe('SignalReportComponent', () => {
  let component: SignalReportComponent;
  let fixture: ComponentFixture<SignalReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignalReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
