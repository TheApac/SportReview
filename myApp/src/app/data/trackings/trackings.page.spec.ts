import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingsPage } from './trackings.page';

describe('TrackingsPage', () => {
  let component: TrackingsPage;
  let fixture: ComponentFixture<TrackingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
