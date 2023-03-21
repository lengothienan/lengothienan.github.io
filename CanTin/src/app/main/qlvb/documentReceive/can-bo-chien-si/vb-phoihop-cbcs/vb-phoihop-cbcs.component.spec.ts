import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VbPhoihopCbcsComponent } from './vb-phoihop-cbcs.component';

describe('VbPhoihopCbcsComponent', () => {
  let component: VbPhoihopCbcsComponent;
  let fixture: ComponentFixture<VbPhoihopCbcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VbPhoihopCbcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VbPhoihopCbcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
