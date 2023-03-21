import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSimpleItemComponent } from './widget-simple-item.component';

describe('WidgetSimpleItemComponent', () => {
  let component: WidgetSimpleItemComponent;
  let fixture: ComponentFixture<WidgetSimpleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetSimpleItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetSimpleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
