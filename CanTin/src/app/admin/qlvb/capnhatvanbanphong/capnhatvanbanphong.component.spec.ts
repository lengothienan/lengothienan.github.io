import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapnhatvanbanphongComponent } from './capnhatvanbanphong.component';

describe('CapnhatvanbanphongComponent', () => {
  let component: CapnhatvanbanphongComponent;
  let fixture: ComponentFixture<CapnhatvanbanphongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapnhatvanbanphongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapnhatvanbanphongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
