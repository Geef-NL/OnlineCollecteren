import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationModuleSidebarComponent } from './donation-module-sidebar.component';

describe('DonationModuleSidebarComponent', () => {
  let component: DonationModuleSidebarComponent;
  let fixture: ComponentFixture<DonationModuleSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationModuleSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationModuleSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
